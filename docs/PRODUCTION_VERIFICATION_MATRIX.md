# Production Verification Matrix

This matrix tracks what is already proven in the current v2.36 integration cycle and what still needs execution.

## Proven in current cycle

### Consumer app: pos-app integration

- Fork dependency consumed from GitHub tarball (`4.5.0`, fork commit pinned).
- iOS native permission/protocol declarations present for Epson flows.
- Android native permission declarations present for Epson flows.

### Real hardware runtime (iOS, TM-T82III, LAN/TCP)

| Test                  | Status | Evidence summary                     |
| --------------------- | ------ | ------------------------------------ |
| Connection + status   | PASS   | Connected and online status returned |
| Sample receipt        | PASS   | Receipt printed                      |
| Barcode + QR          | PASS   | Ticket printed with barcode and QR   |
| Read printer settings | PASS   | Paper width, density, speed returned |
| Cash drawer pulse     | PASS   | Drawer command sent successfully     |
| Sound command         | PASS   | Sound command sent successfully      |

## Not yet executed in current cycle

| Area                                                              | Status  |
| ----------------------------------------------------------------- | ------- |
| Android hardware runtime matrix                                   | NOT RUN |
| USB transport runtime matrix (Android/iOS)                        | NOT RUN |
| Bluetooth Classic runtime matrix (Android/iOS)                    | NOT RUN |
| iOS Bluetooth LE discovery runtime matrix                         | NOT RUN |
| EasySelect runtime matrix (createQR/parseQR/parseNFC/parseBeacon) | NOT RUN |
| Long-run stress (50+ consecutive jobs per transport)              | NOT RUN |

## Build and static gates (current cycle)

| Gate                                                        | Status |
| ----------------------------------------------------------- | ------ |
| Consumer app TypeScript (`npx tsc --noEmit --pretty false`) | PASS   |

## Acceptance criteria for production sign-off

1. All required transports for your deployment are PASS on real hardware.
2. EasySelect pathways you use are PASS on target platforms.
3. Recovery paths are validated (offline, cover open, paper end).
4. Stress run completes without memory/leak/reconnect regression.

## Regression policy

Re-run this matrix when any of the following change:

- Epson SDK baseline.
- React Native major version.
- Native bridge method surface.
- Permission and capability configuration.
