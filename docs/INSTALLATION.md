# Installation

## Baseline Requirements

- Android New Architecture must be enabled (`newArchEnabled=true`).
- iOS minimum deployment target must be 15.0.
- Install pods after dependency install on iOS.

## Bare React Native

### 1. Install package

```sh
yarn add react-native-esc-pos-printer
```

or

```sh
npm install react-native-esc-pos-printer
```

### 2. Android setup

Ensure your app manifest includes required Epson transport permissions.

File: `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.NFC" />

<uses-feature
    android:name="android.hardware.nfc"
    android:required="false" />

<uses-permission
    android:name="android.permission.BLUETOOTH_SCAN"
    android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

<uses-permission
    android:name="android.permission.BLUETOOTH"
    android:maxSdkVersion="30" />
<uses-permission
    android:name="android.permission.BLUETOOTH_ADMIN"
    android:maxSdkVersion="30" />
<uses-permission
    android:name="android.permission.ACCESS_FINE_LOCATION"
    android:maxSdkVersion="30" />
<uses-permission
    android:name="android.permission.ACCESS_COARSE_LOCATION"
    android:maxSdkVersion="28" />
```

If your app overrides RN architecture ABIs, keep `armeabi-v7a` if you need 32-bit support.

File: `android/gradle.properties`

```properties
newArchEnabled=true
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

### 3. iOS setup

Set minimum iOS version to 15.0 or higher.

Run:

```sh
cd ios
pod install
```

Add required Info.plist keys in your app:

- `NSBluetoothAlwaysUsageDescription`
- `NSLocalNetworkUsageDescription`
- `UISupportedExternalAccessoryProtocols` contains `com.epson.escpos`

If you use EasySelect iOS runtime scanners:

- `NFCReaderUsageDescription` for `parseNFC`
- `NSLocationWhenInUseUsageDescription` for `parseBeacon`

For LAN discovery on iOS 14+, local-network permission prompt must be accepted.

## Expo (prebuild)

```sh
npx expo install react-native-esc-pos-printer
npx expo prebuild
```

Then ensure equivalent Android permissions and iOS Info.plist keys are present in `app.json` or `app.config.*`.

Example iOS fragment:

```json
{
  "ios": {
    "infoPlist": {
      "NSBluetoothAlwaysUsageDescription": "Use Bluetooth to discover and connect to Epson printers.",
      "NSLocalNetworkUsageDescription": "Use local network to discover Epson LAN printers.",
      "NFCReaderUsageDescription": "Use NFC to parse Epson EasySelect tags.",
      "NSLocationWhenInUseUsageDescription": "Use location to range Epson EasySelect beacons.",
      "UISupportedExternalAccessoryProtocols": ["com.epson.escpos"]
    }
  }
}
```

## Post-install sanity check

1. Discovery can start and stop without native errors.
2. At least one connect/print/disconnect cycle completes on real hardware.
3. iOS pod install resolves both `libepos2.xcframework` and `libeposeasyselect.xcframework`.

For permission rationale details, see [androidPermissions.md](androidPermissions.md).
