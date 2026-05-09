# SDK Baseline

This fork is aligned to Epson ePOS SDK v2.36.0 integration.

## Version Summary

| Platform | Baseline         | Evidence                                                                                |
| -------- | ---------------- | --------------------------------------------------------------------------------------- |
| Android  | ePOS SDK v2.36.0 | Vendored `ePOS2.jar`, `ePOSEasySelect.jar`, and ABI `.so` files in `package/android`    |
| iOS      | ePOS SDK v2.36.0 | `package/ios/PrinterSDK/libepos2.xcframework` header marker shows `ePOS SDK Ver.2.36.0` |

## Vendored Artifacts

### Android

- `package/android/libs/ePOS2.jar`
- `package/android/libs/ePOSEasySelect.jar`
- `package/android/src/main/jniLibs/armeabi-v7a/libepos2.so`
- `package/android/src/main/jniLibs/armeabi-v7a/libeposeasyselect.so`
- `package/android/src/main/jniLibs/arm64-v8a/libepos2.so`
- `package/android/src/main/jniLibs/arm64-v8a/libeposeasyselect.so`
- `package/android/src/main/jniLibs/x86/libepos2.so`
- `package/android/src/main/jniLibs/x86/libeposeasyselect.so`
- `package/android/src/main/jniLibs/x86_64/libepos2.so`
- `package/android/src/main/jniLibs/x86_64/libeposeasyselect.so`

### iOS

- `package/ios/PrinterSDK/libepos2.xcframework`
- `package/ios/PrinterSDK/libeposeasyselect.xcframework`

## iOS EasySelect version note

The EasySelect header inside Epson's iOS v2.36 package reports `ePOS EasySelect Ver.2.34.0`.

This is expected from Epson's official packaging and is not a fork mismatch.

## Platform Baselines

- Android compile/target baseline in this package: 35
- Android minimum SDK in this package: 24
- Android New Architecture: required
- iOS minimum deployment target: 15.0

## Source SDK paths used during migration

- `/Users/waleedtariq/Desktop/eposmatic/libs/ePOS_SDK_Android_v2.36.0`
- `/Users/waleedtariq/Desktop/eposmatic/libs/ePOS_SDK_iOS_v2.36.0`

## Vendor reference PDFs (copied into docs)

- [ePOS_SDK_Android_um_en_revAK.pdf](ePOS_SDK_Android_um_en_revAK.pdf)
- [ePOS_SDK_Android_Migration_Guide_en_revE.pdf](ePOS_SDK_Android_Migration_Guide_en_revE.pdf)
- [ePOS_SDK_iOS_um_en_revAJ.pdf](ePOS_SDK_iOS_um_en_revAJ.pdf)
- [ePOS_SDK_iOS_Migration_Guide_en_revE.pdf](ePOS_SDK_iOS_Migration_Guide_en_revE.pdf)

## Related docs

- [INSTALLATION.md](INSTALLATION.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [PLATFORM_DIFFERENCES.md](PLATFORM_DIFFERENCES.md)
- [VERIFICATION_REPORT_v2.36.0.md](VERIFICATION_REPORT_v2.36.0.md)
