# Android Permissions

This package supports LAN/TCP, Bluetooth Classic, USB, and NFC-assisted EasySelect paths.

## Required manifest permissions

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

## Why each permission exists

| Permission                      | Why                                                 |
| ------------------------------- | --------------------------------------------------- |
| `INTERNET`                      | Required for LAN/TCP transport                      |
| `NFC`                           | Required for EasySelect NFC parsing                 |
| `BLUETOOTH_SCAN`                | Bluetooth discovery on Android 12+                  |
| `BLUETOOTH_CONNECT`             | Bluetooth connection on Android 12+                 |
| `BLUETOOTH` / `BLUETOOTH_ADMIN` | Legacy Bluetooth behavior on API <= 30              |
| `ACCESS_FINE_LOCATION`          | Legacy Bluetooth discovery dependencies (API <= 30) |
| `ACCESS_COARSE_LOCATION`        | Legacy Bluetooth discovery dependencies (API <= 28) |

## Runtime permission behavior

The discovery layer requests runtime permissions where required.

- API 31+: requests `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT`.
- API 29-30: requests `ACCESS_FINE_LOCATION`.
- API 28 and lower: requests `ACCESS_COARSE_LOCATION`.

If permissions are denied, discovery returns a permission-related error instead of silently failing.
