# EPSON ESC POS Android IOS SDK

Android: <strong>2.36.0</strong>
iOS: <strong>2.36.0</strong>

This fork vendors Epson SDK artifacts directly in-repo.

## Scope

This fork is printer-only.

- In scope: printer discovery, EasySelect QR/NFC/Beacon helpers, printer command APIs.
- Out of scope: non-printer Epson peripheral runtime APIs.

## Source SDK folders used for migration

- `/Users/waleedtariq/Desktop/eposmatic/libs/ePOS_SDK_Android_v2.36.0`
- `/Users/waleedtariq/Desktop/eposmatic/libs/ePOS_SDK_iOS_v2.36.0`

## Vendored artifacts in this repository

### Android

- `package/android/libs/ePOS2.jar`
- `package/android/libs/ePOSEasySelect.jar`
- `package/android/src/main/jniLibs/<abi>/libepos2.so`
- `package/android/src/main/jniLibs/<abi>/libeposeasyselect.so`

Supported ABIs:

- `armeabi-v7a`
- `arm64-v8a`
- `x86`
- `x86_64`

### iOS

- `package/ios/PrinterSDK/libepos2.xcframework` (dynamic)
- `package/ios/PrinterSDK/libeposeasyselect.xcframework`

## Platform baselines

- Android SDK target baseline: 35
- Android new architecture: required
- iOS minimum deployment target: 15.0

## Notes

- Discovery transport nuance:
	- Android discovery supports `PORTTYPE_TCP`, `PORTTYPE_BLUETOOTH`, and `PORTTYPE_USB`.
	- `PORTTYPE_BLUETOOTH_LE` is exported for iOS discovery only.

- iOS migration follows Epson's static-to-dynamic framework guidance from `ePOS_SDK_iOS_Static_to_Dynamic_Migration_Guide_en.md`.
- EasySelect APIs exposed by the RN layer: `createQR`, `parseQR`, `parseNFC`, `parseBeacon`.
- `parseBeacon` is currently iOS-only. Android returns unsupported for beacon parsing.

## Target expectations

Use the SDK-provided `target` value exactly as emitted by discovery or EasySelect parsing.

- Expected examples: `TCP:192.168.0.10`, `BT:AA:BB:CC:DD:EE:FF`, `USB:...`
- Do not hand-craft or normalize transport prefixes.
