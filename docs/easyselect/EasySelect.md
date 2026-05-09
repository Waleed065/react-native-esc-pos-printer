# EasySelect API

EasySelect provides Epson QR/NFC/Beacon quick printer selection helpers.

## Import

```tsx
import { EasySelect, EasySelectDeviceType } from "react-native-esc-pos-printer";
```

## createQR

Creates Epson EasySelect QR payload from printer metadata.

```tsx
const qrData = await EasySelect.createQR({
  printerName: "TM-m30III",
  deviceType: EasySelectDeviceType.BLUETOOTH,
  macAddress: "AA:BB:CC:DD:EE:FF",
});
```

## parseQR

Parses Epson EasySelect QR payload and returns printer metadata.

```tsx
const info = await EasySelect.parseQR(qrData);

// info.deviceType
// info.printerName
// info.macAddress
// info.target (iOS)
// info.serialNumber / info.ssid / info.passphrase (Android when available)
```

## parseNFC

Starts an NFC read session and parses Epson EasySelect payload from detected NFC tag data.

```tsx
const infos = await EasySelect.parseNFC({
  timeout: 5000,
});

// infos: EasySelectInfo[]
```

Platform notes:

- Android: uses NFC reader mode. Device must support NFC and NFC must be enabled.
- iOS: uses `NFCNDEFReaderSession`.

## parseBeacon

Starts iBeacon ranging and parses Epson EasySelect payload from the first matching beacon.

```tsx
const info = await EasySelect.parseBeacon({
  uuid: "00000000-0000-0000-0000-000000000000",
  major: 100,
  minor: 1,
  timeout: 5000,
});
```

Platform notes:

- iOS: supported. Requires location authorization for beacon ranging.
- Android: currently returns unsupported error.

## Types

`EasySelectInfo`

- `deviceType: number`
- `printerName: string`
- `macAddress: string`
- `target?: string`
- `serialNumber?: string`
- `ssid?: string`
- `passphrase?: string`

`EasySelectCreateQROptions`

- `printerName: string`
- `deviceType: number`
- `macAddress: string`

`EasySelectParseNFCOptions`

- `timeout?: number`

`EasySelectParseBeaconOptions`

- `uuid: string`
- `major?: number`
- `minor?: number`
- `timeout?: number`
