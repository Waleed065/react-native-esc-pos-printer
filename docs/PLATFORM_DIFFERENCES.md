# Platform Differences

This page documents intentional differences between Android and iOS behavior.

## Discovery

| Capability                     | Android                           | iOS       |
| ------------------------------ | --------------------------------- | --------- |
| `PORTTYPE_TCP`                 | Yes                               | Yes       |
| `PORTTYPE_BLUETOOTH`           | Yes                               | Yes       |
| `PORTTYPE_USB`                 | Yes                               | Yes       |
| `PORTTYPE_BLUETOOTH_LE` filter | No (constant exported for parity) | Yes       |
| `enableLocationSetting` flow   | Real settings check/resolution    | Parity no-op + events |
| `pairBluetoothDevice` helper   | No-op                             | Supported |

## EasySelect

| API           | Android     | iOS |
| ------------- | ----------- | --- |
| `createQR`    | Yes         | Yes |
| `parseQR`     | Yes         | Yes |
| `parseNFC`    | Yes         | Yes |
| `parseBeacon` | Unsupported | Yes |

Notes:

- Android `parseBeacon` rejects with `ERR_UNSUPPORTED` by design.
- `parseNFC` requires NFC capability and active platform support (enabled adapter/session).

## Transactions

| Behavior                                       | Android | iOS |
| ---------------------------------------------- | ------- | --- |
| Explicit `beginTransaction/endTransaction` API | Yes     | Yes |
| `sendData` internal transaction handling       | Yes     | Yes |

Recommendation: avoid unnecessary nested transaction logic at app level when a single `sendData` flow is sufficient.

## Permissions and capabilities

| Requirement                   | Android                            | iOS                                            |
| ----------------------------- | ---------------------------------- | ---------------------------------------------- |
| Bluetooth runtime permissions | Required by API level              | Permission prompt via Info.plist               |
| Local network prompt          | N/A                                | Required for LAN discovery on modern iOS       |
| NFC capability for EasySelect | Permission + device support        | `NFCReaderUsageDescription` and NFC capability |
| Beacon support                | Not supported in EasySelect bridge | Requires location permission                   |

## Hardware validation

- Android and iOS simulator/emulator results are not substitutes for real printer verification.
- Always validate each transport you plan to ship.
