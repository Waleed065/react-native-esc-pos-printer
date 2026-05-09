# EasySelect API

EasySelect provides Epson QR/NFC/beacon helpers to derive printer metadata and targets.

## Import

```ts
import { EasySelect, EasySelectDeviceType } from "react-native-esc-pos-printer";
```

## `createQR(options)`

Creates an Epson EasySelect QR payload.

```ts
const qr = await EasySelect.createQR({
  printerName: "TM-m30III",
  deviceType: EasySelectDeviceType.BLUETOOTH,
  macAddress: "AA:BB:CC:DD:EE:FF",
});
```

## `parseQR(data)`

Parses QR payload into `EasySelectInfo`.

```ts
const info = await EasySelect.parseQR(qr);
```

## `parseNFC(options?)`

Parses NFC tag payloads.

Platform behavior:

- Android: requires an enabled NFC adapter; rejects unsupported when NFC is unavailable.
- iOS: requires NFC reading availability (`NFCNDEFReaderSession.readingAvailable`).

```ts
const infos = await EasySelect.parseNFC({ timeout: 5000 });
```

## `parseBeacon(options)`

Parses beacon payload for matching Epson beacon parameters.

Platform behavior:

- iOS: supported.
- Android: exported for API parity, rejects with `ERR_UNSUPPORTED`.

```ts
const info = await EasySelect.parseBeacon({
  uuid: "00000000-0000-0000-0000-000000000000",
  major: 100,
  minor: 1,
  timeout: 5000,
});
```

## Platform support

| API           | Android     | iOS |
| ------------- | ----------- | --- |
| `createQR`    | Yes         | Yes |
| `parseQR`     | Yes         | Yes |
| `parseNFC`    | Yes         | Yes |
| `parseBeacon` | No (`ERR_UNSUPPORTED`) | Yes |

## Types

- EasySelect response and option types are exported from the package root.
- Core shape references are also documented in [deviceInfo](../interfaces/deviceInfo.md).

## Permission reminders

- iOS `parseNFC`: requires `NFCReaderUsageDescription`.
- iOS `parseBeacon`: requires `NSLocationWhenInUseUsageDescription`.
