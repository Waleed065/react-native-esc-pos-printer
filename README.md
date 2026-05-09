# react-native-esc-pos-printer (Fork)

Unofficial React Native Epson TM printer bridge powered by Epson ePOS SDK Android v2.36.0 and Epson ePOS SDK iOS v2.36.0.

This fork is focused on stable printer flows, explicit platform behavior, and clear production verification.

## Scope

- In scope: discovery, connection, print command APIs, status/settings, EasySelect helpers.
- Out of scope: non-printer Epson peripheral runtime APIs.

## SDK Baseline

- Android: Epson ePOS SDK v2.36.0
- iOS: Epson ePOS SDK v2.36.0

See [docs/SDK.md](docs/SDK.md) for artifact-level details.

## Requirements

- React Native app (bare or Expo prebuild workflow).
- Android New Architecture is required for this package.
- iOS minimum deployment target is 15.0.

## Install

```sh
yarn add react-native-esc-pos-printer
```

or

```sh
npm install react-native-esc-pos-printer
```

Complete platform setup in [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Quick Usage

```tsx
import React, { useEffect } from "react";
import { Button, View } from "react-native";
import {
  Printer,
  PrinterConstants,
  usePrintersDiscovery,
} from "react-native-esc-pos-printer";

export default function App() {
  const { start, printers } = usePrintersDiscovery();

  useEffect(() => {
    start({
      autoStop: true,
      timeout: 10000,
    });
  }, [start]);

  const printFirstDiscovered = async () => {
    const first = printers[0];
    if (!first) return;

    const printer = new Printer({
      target: first.target,
      deviceName: first.deviceName,
    });

    try {
      await Printer.tryToConnectUntil(
        printer,
        (status) => status.online.status === "TRUE",
        { maxAttempts: 3 },
      );

      await printer.addTextAlign(PrinterConstants.ALIGN_CENTER);
      await printer.addText("HELLO EPSON\n");
      await printer.addFeedLine(1);
      await printer.addCut(PrinterConstants.CUT_FEED);
      await printer.sendData();
    } finally {
      await printer.disconnect();
    }
  };

  return (
    <View>
      <Button title="Print" onPress={printFirstDiscovered} />
    </View>
  );
}
```

More examples: [docs/QUICK_START.md](docs/QUICK_START.md)

## EasySelect

```tsx
import { EasySelect, EasySelectDeviceType } from "react-native-esc-pos-printer";

const qr = await EasySelect.createQR({
  printerName: "TM-m30III",
  deviceType: EasySelectDeviceType.TCP,
  macAddress: "AA:BB:CC:DD:EE:FF",
});

const parsed = await EasySelect.parseQR(qr);
```

EasySelect docs: [docs/easyselect/EasySelect.md](docs/easyselect/EasySelect.md)

## Platform Notes

- `PORTTYPE_BLUETOOTH_LE` discovery filter is iOS-only.
- `EasySelect.parseBeacon` is iOS-only. Android returns unsupported.
- `pairBluetoothDevice` performs pairing on iOS, and resolves as a no-op on Android.
- Discovery start may trigger Android location-settings resolution on supported API levels.
- iOS does not use the Android location-settings flow (parity success/failure events only).
- `EasySelect.parseNFC` requires platform NFC capability and enabled hardware/session support.
- Android simulator does not represent real printer hardware behavior.
- Always use the exact `target` produced by discovery/EasySelect.

## Documentation

- [Documentation Index](docs/INDEX.md)
- [Installation](docs/INSTALLATION.md)
- [Quick Start](docs/QUICK_START.md)
- [SDK Baseline](docs/SDK.md)
- [Production Verification Matrix](docs/PRODUCTION_VERIFICATION_MATRIX.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Migration v2.27 to v2.36](docs/MIGRATION_v2.27_to_v2.36.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Platform Differences](docs/PLATFORM_DIFFERENCES.md)
- [Best Practices](docs/BEST_PRACTICES.md)
- [Performance](docs/PERFORMANCE.md)
- [Android SDK user manual PDF](docs/ePOS_SDK_Android_um_en_revAK.pdf)
- [Android SDK migration guide PDF](docs/ePOS_SDK_Android_Migration_Guide_en_revE.pdf)
- [iOS SDK user manual PDF](docs/ePOS_SDK_iOS_um_en_revAJ.pdf)
- [iOS SDK migration guide PDF](docs/ePOS_SDK_iOS_Migration_Guide_en_revE.pdf)

## Verification Report

Current integration verification for the v2.36 baseline is documented at:

- [docs/VERIFICATION_REPORT_v2.36.0.md](docs/VERIFICATION_REPORT_v2.36.0.md)

## License

MIT
