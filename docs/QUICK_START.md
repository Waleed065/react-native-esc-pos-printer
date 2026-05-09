# Quick Start

This guide shows a minimal flow:

1. Discover printers.
2. Select one `target` and `deviceName`.
3. Connect, queue commands, send data, disconnect.

## Minimal Print Flow

```tsx
import React, { useMemo, useState } from "react";
import { Button, Text, View } from "react-native";
import {
  DiscoveryPortType,
  Printer,
  PrinterConstants,
  usePrintersDiscovery,
} from "react-native-esc-pos-printer";

export function QuickStartScreen() {
  const [busy, setBusy] = useState(false);
  const { start, stop, printers, isDiscovering, printerError } =
    usePrintersDiscovery();

  const firstLanPrinter = useMemo(
    () => printers.find((p) => p.target.startsWith("TCP:")),
    [printers],
  );

  const discoverLan = async () => {
    await stop();
    await start({
      timeout: 10000,
      autoStop: true,
      filterOption: { portType: DiscoveryPortType.PORTTYPE_TCP },
    });
  };

  const print = async () => {
    if (!firstLanPrinter) return;

    setBusy(true);

    const printer = new Printer({
      target: firstLanPrinter.target,
      deviceName: firstLanPrinter.deviceName,
    });

    try {
      await Printer.tryToConnectUntil(
        printer,
        (status) => status.online.status === "TRUE",
        { maxAttempts: 3 },
      );

      await printer.addTextAlign(PrinterConstants.ALIGN_CENTER);
      await printer.addTextStyle({ em: PrinterConstants.TRUE });
      await printer.addText("QUICK START\n");
      await printer.addTextStyle();
      await printer.addFeedLine(1);
      await printer.addText(`Target: ${firstLanPrinter.target}\n`);
      await printer.addFeedLine(2);
      await printer.addCut(PrinterConstants.CUT_FEED);
      await printer.sendData();
    } finally {
      await printer.disconnect();
      setBusy(false);
    }
  };

  return (
    <View>
      <Button
        title={isDiscovering ? "Discovering..." : "Discover LAN"}
        onPress={discoverLan}
        disabled={busy || isDiscovering}
      />

      <Button
        title="Print"
        onPress={print}
        disabled={busy || !firstLanPrinter}
      />

      {printerError ? <Text>{printerError.message}</Text> : null}
      <Text>
        {firstLanPrinter
          ? `Selected: ${firstLanPrinter.deviceName} (${firstLanPrinter.target})`
          : "No LAN printer selected yet."}
      </Text>
    </View>
  );
}
```

## Important Rules

- Use the exact SDK-provided `target` string.
- Always disconnect in `finally`.
- Do not treat simulator results as production validation.

## Next

- Discovery API details: [discovery/discovery.md](discovery/discovery.md)
- Printer API details: [printer/Printer.md](printer/Printer.md)
- EasySelect API details: [easyselect/EasySelect.md](easyselect/EasySelect.md)
