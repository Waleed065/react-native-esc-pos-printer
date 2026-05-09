# Verification Report: Epson v2.36.0 Integration

Date: 2026-05-09

## Objective

Verify that the fork is properly integrated with:

- ePOS_SDK_Android_v2.36.0
- ePOS_SDK_iOS_v2.36.0

and that consumer integration evidence is consistent with this baseline.

## Result

PASS

No blocking integration defects were found in Android or iOS native wiring for the fork package.

## Evidence: fork package

### Android

- Gradle wiring enforces New Architecture and includes jar linkage:
  - `package/android/build.gradle`
- SDK jars present:
  - `package/android/libs/ePOS2.jar`
  - `package/android/libs/ePOSEasySelect.jar`
- Native ABI libs present for all shipped ABIs:
  - `package/android/src/main/jniLibs/armeabi-v7a`
  - `package/android/src/main/jniLibs/arm64-v8a`
  - `package/android/src/main/jniLibs/x86`
  - `package/android/src/main/jniLibs/x86_64`
- Android manifest includes required transport permissions:
  - `package/android/src/main/AndroidManifest.xml`

### iOS

- Podspec vendors Epson frameworks and sets iOS 15 baseline:
  - `package/react-native-esc-pos-printer.podspec`
- Frameworks present:
  - `package/ios/PrinterSDK/libepos2.xcframework`
  - `package/ios/PrinterSDK/libeposeasyselect.xcframework`
- iOS header marker confirms core SDK version:
  - `package/ios/PrinterSDK/libepos2.xcframework/ios-arm64/libepos2.framework/Headers/ePOS2.h`

## Version marker note

The EasySelect iOS header in Epson's v2.36 package reports `ePOS EasySelect Ver.2.34.0`.
This matches vendor packaging behavior and is not treated as an integration mismatch.

## Evidence: consumer app (pos-app)

- Fork dependency is pinned to fork tarball source:
  - `pos-app/package.json`
- Android consumer baseline evidence:
  - `pos-app/android/gradle.properties`
  - `pos-app/android/app/src/main/AndroidManifest.xml`
- iOS consumer baseline evidence:
  - `pos-app/ios/pos/Info.plist`
- App runtime harness uses fork APIs:
  - `pos-app/App.tsx`

## Runtime evidence observed in this cycle

On iOS with TM-T82III over LAN/TCP, these tests passed in the consumer harness:

- connection/status
- sample receipt
- barcode + QR
- printer settings read
- cash drawer pulse
- sound command

## Non-blocking observations

- Consumer app may still contain unrelated legacy accessory-filter entries from prior integrations. This does not block fork SDK-integration sign-off.

## Conclusion

Fork integration is acceptable for Epson ePOS SDK v2.36.0 baseline on Android and iOS.
