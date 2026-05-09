# Supported Devices

## Epson models

This package targets Epson printers supported by Epson ePOS SDK v2.36.0.

Use Epson's official SDK manuals for the complete, authoritative model list for your platform and transport.

- Android manual: [ePOS_SDK_Android_um_en_revAK.pdf](ePOS_SDK_Android_um_en_revAK.pdf)
- iOS manual: [ePOS_SDK_iOS_um_en_revAJ.pdf](ePOS_SDK_iOS_um_en_revAJ.pdf)

## Field-validated in current cycle

- `TM-T82III` (LAN/TCP on iOS) verified for:
  - connect/status
  - sample receipt print
  - barcode + QR print
  - printer settings read
  - drawer pulse
  - sound command

See [PRODUCTION_VERIFICATION_MATRIX.md](PRODUCTION_VERIFICATION_MATRIX.md).

## Compatibility notes for ESC/POS clones

Some non-Epson printers that emulate Epson ESC/POS may work for subsets of commands.

- Not guaranteed by this package.
- Transport and command parity can differ by vendor firmware.
- Always validate on your target hardware before production rollout.

## Device-reporting best practice

When reporting a compatibility issue, include:

1. Printer model and firmware.
2. Transport (`TCP`, `BT`, `USB`).
3. Exact `target` value emitted by discovery.
4. Failing API method and error payload.
5. Whether issue is Android, iOS, or both.
