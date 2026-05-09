# Production Verification Matrix (Printer-Only)

This checklist is for production-readiness verification of this fork as a printer-only React Native bridge.

## Scope

- Printer discovery
- Printer command/connection runtime
- EasySelect QR/NFC/Beacon helpers
- Android + iOS parity where supported by Epson SDKs

## Build-time verification (completed)

Library package (`package/`):

- [x] `npm run typecheck`
- [x] `npm run prepare`

Consumer app validation (`pos-app` with local tarball install):

- [x] `npx tsc --noEmit --pretty false`
- [x] `./android/gradlew app:assembleDebug`
- [x] `xcodebuild -workspace pos.xcworkspace -scheme pos -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' build`

## Connection transport matrix (real hardware)

| Transport                     | Android | iOS                           | Expected target sample | Status               |
| ----------------------------- | ------- | ----------------------------- | ---------------------- | -------------------- |
| TCP/LAN                       | Yes     | Yes                           | `TCP:192.168.0.10`     | Pending hardware run |
| Bluetooth Classic             | Yes     | Yes                           | `BT:AA:BB:CC:DD:EE:FF` | Pending hardware run |
| USB                           | Yes     | Yes                           | `USB:...`              | Pending hardware run |
| Bluetooth LE discovery filter | No      | Yes (`PORTTYPE_BLUETOOTH_LE`) | SDK-provided target    | Pending hardware run |

Notes:

- Always use the exact `target` emitted by discovery/EasySelect.
- Do not manually construct target strings.

## EasySelect matrix (real hardware)

| API           | Android     | iOS | Notes                                                       | Status               |
| ------------- | ----------- | --- | ----------------------------------------------------------- | -------------------- |
| `createQR`    | Yes         | Yes | Build QR payload from printer metadata                      | Pending hardware run |
| `parseQR`     | Yes         | Yes | Parse Epson QR payload                                      | Pending hardware run |
| `parseNFC`    | Yes         | Yes | iOS requires NFC capability and `NFCReaderUsageDescription` | Pending hardware run |
| `parseBeacon` | Unsupported | Yes | iOS requires location permission                            | Pending hardware run |

## Printer command coverage matrix (real hardware)

### Core flow

- [ ] `initWithPrinterDeviceName`
- [ ] `connect`
- [ ] `beginTransaction` / `endTransaction`
- [ ] `clearCommandBuffer`
- [ ] `sendData`
- [ ] `disconnect`

### Common content commands

- [ ] `addText` / `addTextLang` / `addTextAlign` / `addTextStyle` / `addTextSize`
- [ ] `addFeedLine` / `addLineSpace` / `addCut` / `addPulse`
- [ ] `addImage` / `addBarcode` / `addSymbol` / `addCommand`

### Advanced parity commands

- [ ] `addTextRotate` / `addTextFont` / `addHPosition` / `addFeedUnit`
- [ ] `addLogo`
- [ ] `addPageBegin` / `addPageEnd` / `addPageArea` / `addPageDirection` / `addPagePosition`
- [ ] `addPageLine` / `addPageRectangle`
- [ ] `addSound` / `addFeedPosition`
- [ ] `addHLine` / `addVLineBegin` / `addVLineEnd`
- [ ] `addLayout`
- [ ] `addRotateBegin` / `addRotateEnd`

### Status/setting APIs

- [ ] `getStatus`
- [ ] `getPrinterSetting`

## Acceptance criteria

- No command call returns Epson error codes under nominal conditions.
- Output on paper matches the requested layout for each tested command group.
- Repeated print cycles (>= 50 consecutive jobs per transport) complete without memory or connection regression.
- Recovery path validated for offline/cover-open/paper-end states.

## Regression guardrails

- Re-run this matrix after Epson SDK updates, RN major updates, or native method-surface changes.
- Keep Android and iOS method/constant parity in lockstep with documented platform differences only.
