# Migration Guide: v2.27 lineage to v2.36 baseline

This guide summarizes practical migration impact for apps upgrading from older ePOS SDK generations to this fork baseline.

## Baseline changes

1. SDK baseline moved to Epson v2.36.0 integration.
2. Android package requires New Architecture (`newArchEnabled=true`).
3. iOS minimum deployment target is 15.0.
4. iOS integration uses dynamic `libepos2.xcframework` packaging.
5. Documentation and verification model now center on explicit platform differences.

## App-level required updates

### Android

- Ensure New Architecture is enabled.
- Ensure required Bluetooth, location (legacy API levels), and NFC permissions are declared.
- If you override ABI list, keep required ABIs for your deployment targets.

### iOS

- Set deployment target to at least 15.0.
- Run `pod install` after updating dependency.
- Ensure Info.plist contains Bluetooth/local-network keys and Epson external accessory protocol.
- Add NFC/location keys if using EasySelect NFC/beacon APIs.

## Behavioral notes

- Always use SDK-provided `target` values directly.
- `parseBeacon` is iOS-only.
- BLE discovery filter is iOS-only.

## Suggested upgrade verification checklist

1. Discovery pass on target transport(s).
2. Connect/status pass.
3. Sample text print pass.
4. Barcode/QR pass.
5. Drawer and sound commands pass if used.
6. Settings/status APIs pass where applicable.
7. EasySelect APIs pass if used.

## Common migration pitfalls

- Missing iOS local-network or Bluetooth usage keys.
- Android runtime permission denial interpreted as discovery failure.
- Manual target-string rewriting in app code.
- Expecting Android support for `parseBeacon`.
