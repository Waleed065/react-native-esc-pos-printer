# Troubleshooting

## Discovery returns no printers

1. Confirm transport and network/Bluetooth conditions.
2. Confirm runtime permissions were granted.
3. Retry discovery with explicit `filterOption.portType`.
4. Test on real hardware (simulators/emulators are limited).

## Bluetooth discovery fails on Android

- API 31+: `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT` are required.
- API 29-30: `ACCESS_FINE_LOCATION` is required for legacy discovery behavior.
- API <= 28: `ACCESS_COARSE_LOCATION` is required.

## iOS LAN discovery does not find device

- Ensure `NSLocalNetworkUsageDescription` exists.
- Accept local network permission prompt.
- Confirm printer and phone are on reachable network segments.

## Error: no communication had been started

This usually means command flow was attempted before communication was fully ready or transaction state was interrupted.

Recommended recovery:

1. Disconnect.
2. Reconnect.
3. Retry command sequence once.
4. Keep command flow simple (`connect -> queue -> sendData -> disconnect`).

## `parseNFC` not working on iOS

- Add `NFCReaderUsageDescription`.
- Enable Near Field Communication Tag Reading capability.
- Confirm device supports NFC tag reading.

## `parseBeacon` not working on iOS

- Add `NSLocationWhenInUseUsageDescription`.
- Ensure location authorization is granted.
- Ensure beacon UUID/major/minor inputs are correct.

## `parseBeacon` on Android

`parseBeacon` is currently unsupported in Android bridge behavior.

## Build-time iOS codegen issues involving generated spec header

If you hit generated `RNEscPosPrinterSpec.h` issues after install, run install scripts again so `scripts/patch-ios-codegen.js` can patch generated headers.

## React Native app shows "Unable to load script" in debug

This is usually unrelated to printer logic and means Metro is not serving JS bundle.

- Start Metro on the expected port (usually 8081).
- Retry app launch.
