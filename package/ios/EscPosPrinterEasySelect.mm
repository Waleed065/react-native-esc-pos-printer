#import "EscPosPrinterEasySelect.h"

#import "ePOSEasySelect.h"
#import <libepos2/ePOS2.h>

#import <CoreLocation/CoreLocation.h>
#import <CoreNFC/CoreNFC.h>

@interface EscPosPrinterEasySelect () <NFCNDEFReaderSessionDelegate, CLLocationManagerDelegate>

@property (nonatomic, strong) EposEasySelect *easySelect;

@property (nonatomic, strong) NFCNDEFReaderSession *nfcSession;
@property (nonatomic, assign) long nfcTimeout;
@property (nonatomic, copy) RCTPromiseResolveBlock nfcResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock nfcReject;

@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) CLBeaconIdentityConstraint *beaconConstraint;
@property (nonatomic, strong) NSTimer *beaconTimeoutTimer;
@property (nonatomic, copy) RCTPromiseResolveBlock beaconResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock beaconReject;

@end

@implementation EscPosPrinterEasySelect

RCT_EXPORT_MODULE()

- (instancetype)init
{
  self = [super init];
  if (self) {
    _easySelect = [[EposEasySelect alloc] init];
    _nfcTimeout = PARSE_NFC_TIMEOUT_DEFAULT;
  }

  return self;
}

#if RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeEscPosPrinterEasySelectSpecJSI>(params);
}
#endif

- (NSDictionary *)constantsToExport
{
  return @{
    @"DEVICE_TYPE_TCP": @(EPOS_EASY_SELECT_DEVTYPE_TCP),
    @"DEVICE_TYPE_BLUETOOTH": @(EPOS_EASY_SELECT_DEVTYPE_BLUETOOTH),
    @"PARSE_NFC_TIMEOUT_DEFAULT": @(PARSE_NFC_TIMEOUT_DEFAULT)
  };
}

- (NSDictionary *)getConstants {
  return [self constantsToExport];
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(createQR:(NSString *)printerName
                  deviceType:(double)deviceType
                  macAddress:(NSString *)macAddress
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    @synchronized (self) {
      NSString *qrData = [self.easySelect createQR:printerName DeviceType:(int)deviceType MacAddress:macAddress];

      if (qrData == nil || [qrData length] == 0) {
        reject(@"event_failure", @"-1", nil);
        return;
      }

      resolve(qrData);
    }
}

RCT_EXPORT_METHOD(parseQR:(NSString *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    @synchronized (self) {
      EposEasySelectInfo *info = [self.easySelect parseQR:data];

      if (info == nil) {
        reject(@"event_failure", @"-1", nil);
        return;
      }

      resolve([self convertInfoToDictionary:info includeTarget:YES]);
    }
}

RCT_EXPORT_METHOD(parseNFC:(double)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    @synchronized (self) {
      if (self.nfcResolve != nil) {
        reject(@"event_failure", [@(EPOS2_ERR_PROCESSING) stringValue], nil);
        return;
      }

      if (![NFCNDEFReaderSession readingAvailable]) {
        reject(@"event_failure", [@(EPOS2_ERR_UNSUPPORTED) stringValue], nil);
        return;
      }

      self.nfcTimeout = timeout > 0 ? (long)timeout : PARSE_NFC_TIMEOUT_DEFAULT;
      self.nfcResolve = resolve;
      self.nfcReject = reject;

      self.nfcSession = [[NFCNDEFReaderSession alloc] initWithDelegate:self
                                                                  queue:nil
                                               invalidateAfterFirstRead:YES];
      self.nfcSession.alertMessage = @"Hold your iPhone near an Epson EasySelect NFC tag.";
      [self.nfcSession beginSession];
    }
}

RCT_EXPORT_METHOD(parseBeacon:(NSString *)uuid
                  major:(double)major
                  minor:(double)minor
                  timeout:(double)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    @synchronized (self) {
      if (self.beaconResolve != nil) {
        reject(@"event_failure", [@(EPOS2_ERR_PROCESSING) stringValue], nil);
        return;
      }

      NSUUID *proximityUUID = [[NSUUID alloc] initWithUUIDString:uuid];
      if (proximityUUID == nil) {
        reject(@"event_failure", [@(EPOS2_ERR_PARAM) stringValue], nil);
        return;
      }

      self.beaconResolve = resolve;
      self.beaconReject = reject;

      if (major >= 0 && minor >= 0) {
        self.beaconConstraint = [[CLBeaconIdentityConstraint alloc] initWithUUID:proximityUUID
                                                                           major:(CLBeaconMajorValue)major
                                                                           minor:(CLBeaconMinorValue)minor];
      } else if (major >= 0) {
        self.beaconConstraint = [[CLBeaconIdentityConstraint alloc] initWithUUID:proximityUUID
                                                                           major:(CLBeaconMajorValue)major];
      } else {
        self.beaconConstraint = [[CLBeaconIdentityConstraint alloc] initWithUUID:proximityUUID];
      }

      if (self.locationManager == nil) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
      }

      NSTimeInterval timeoutSeconds = timeout > 0 ? timeout / 1000.0 : 5.0;
      self.beaconTimeoutTimer = [NSTimer scheduledTimerWithTimeInterval:timeoutSeconds
                                                                  target:self
                                                                selector:@selector(handleBeaconTimeout)
                                                                userInfo:nil
                                                                 repeats:NO];

      [self startBeaconRangingIfAuthorized];
    }
}

- (void)readerSession:(NFCNDEFReaderSession *)session
didDetectNDEFs:(NSArray<NFCNDEFMessage *> *)messages
{
    @synchronized (self) {
      if (self.nfcResolve == nil) {
        return;
      }

      NSArray<EposEasySelectInfo *> *parsedInfos = [self.easySelect parseNFC:messages timeout:self.nfcTimeout];
      NSMutableArray<NSDictionary *> *result = [[NSMutableArray alloc] initWithCapacity:[parsedInfos count]];

      for (EposEasySelectInfo *info in parsedInfos) {
        [result addObject:[self convertInfoToDictionary:info includeTarget:YES]];
      }

      self.nfcResolve(result);
      [self clearNfcState];
    }
}

- (void)readerSession:(NFCNDEFReaderSession *)session didInvalidateWithError:(NSError *)error
{
    @synchronized (self) {
      if (self.nfcReject != nil) {
        self.nfcReject(@"event_failure", [@(error.code) stringValue], error);
      }

      [self clearNfcState];
    }
}

- (void)locationManagerDidChangeAuthorization:(CLLocationManager *)manager
{
    [self startBeaconRangingIfAuthorized];
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    [self startBeaconRangingIfAuthorized];
}

- (void)locationManager:(CLLocationManager *)manager
        didRangeBeacons:(NSArray<CLBeacon *> *)beacons
       satisfyingConstraint:(CLBeaconIdentityConstraint *)constraint API_AVAILABLE(ios(13.0))
{
    @synchronized (self) {
      if (self.beaconResolve == nil || [beacons count] == 0) {
        return;
      }

      EposEasySelectInfo *info = [self.easySelect parseBeacon:[beacons firstObject]];
      if (info == nil) {
        return;
      }

      self.beaconResolve([self convertInfoToDictionary:info includeTarget:YES]);
      [self clearBeaconState];
    }
}

- (void)locationManager:(CLLocationManager *)manager
didFailRangingBeaconsForConstraint:(CLBeaconIdentityConstraint *)constraint
              error:(NSError *)error API_AVAILABLE(ios(13.0))
{
    @synchronized (self) {
      if (self.beaconReject != nil) {
        self.beaconReject(@"event_failure", [@(error.code) stringValue], error);
      }

      [self clearBeaconState];
    }
}

- (void)handleBeaconTimeout
{
    @synchronized (self) {
      if (self.beaconReject != nil) {
        self.beaconReject(@"event_failure", [@(EPOS2_ERR_TIMEOUT) stringValue], nil);
      }

      [self clearBeaconState];
    }
}

- (void)startBeaconRangingIfAuthorized
{
    if (self.beaconResolve == nil || self.beaconConstraint == nil) {
      return;
    }

    CLAuthorizationStatus status;
    if (@available(iOS 14.0, *)) {
      status = self.locationManager.authorizationStatus;
    } else {
      status = [CLLocationManager authorizationStatus];
    }

    if (status == kCLAuthorizationStatusNotDetermined) {
      [self.locationManager requestWhenInUseAuthorization];
      return;
    }

    if (status == kCLAuthorizationStatusDenied || status == kCLAuthorizationStatusRestricted) {
      if (self.beaconReject != nil) {
        self.beaconReject(@"event_failure", [@(EPOS2_ERR_UNSUPPORTED) stringValue], nil);
      }

      [self clearBeaconState];
      return;
    }

    if (@available(iOS 13.0, *)) {
      [self.locationManager startRangingBeaconsSatisfyingConstraint:self.beaconConstraint];
    } else {
      if (self.beaconReject != nil) {
        self.beaconReject(@"event_failure", [@(EPOS2_ERR_UNSUPPORTED) stringValue], nil);
      }

      [self clearBeaconState];
    }
}

- (NSDictionary *)convertInfoToDictionary:(EposEasySelectInfo *)info includeTarget:(BOOL)includeTarget
{
    NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
    result[@"deviceType"] = @(info.deviceType);
    result[@"printerName"] = info.printerName ?: @"";
    result[@"macAddress"] = info.macAddress ?: @"";

    if (includeTarget && info.target != nil) {
      result[@"target"] = info.target;
    }

    return result;
}

- (void)clearNfcState
{
    self.nfcSession = nil;
    self.nfcResolve = nil;
    self.nfcReject = nil;
    self.nfcTimeout = PARSE_NFC_TIMEOUT_DEFAULT;
}

- (void)clearBeaconState
{
    if (self.beaconTimeoutTimer != nil) {
      [self.beaconTimeoutTimer invalidate];
      self.beaconTimeoutTimer = nil;
    }

    if (@available(iOS 13.0, *)) {
      if (self.locationManager != nil && self.beaconConstraint != nil) {
        [self.locationManager stopRangingBeaconsSatisfyingConstraint:self.beaconConstraint];
      }
    }

    self.beaconConstraint = nil;
    self.beaconResolve = nil;
    self.beaconReject = nil;
}

@end
