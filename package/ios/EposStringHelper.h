#import <Foundation/Foundation.h>
#import <libepos2/ePOS2.h>

@interface EposStringHelper : NSObject

+ (NSDictionary *)convertStatusInfoToDictionary:(Epos2PrinterStatusInfo *)status;
+ (NSDictionary *)getDiscoveryConstants;
+ (NSDictionary *)getPrinterConstants;
+ (NSString *)convertDictionatyToJsonString:(NSDictionary *)dict;
+ (int)getPrinterSeries:(NSString*)name;
+ (int)getInitErrorResultCode;

@end
