# Printer API

`Printer` is the main class for connection and command-buffer printing.

## Import

```ts
import { Printer, PrinterConstants } from "react-native-esc-pos-printer";
```

## Constructor

```ts
const printer = new Printer({
  target: "TCP:192.168.0.10",
  deviceName: "TM-T82III",
});
```

Reference: [constructor.md](constructor.md)

## Typical lifecycle

```ts
await printer.connect();
await printer.addText("Hello\n");
await printer.addCut(PrinterConstants.CUT_FEED);
await printer.sendData();
await printer.disconnect();
```

## Core methods

- [connect](connect.md)
- [disconnect](disconnect.md)
- [sendData](sendData.md)
- `beginTransaction()` (explicit API available)
- `endTransaction()` (explicit API available)
- [getStatus](getStatus.md)
- [getPrinterSetting](getPrinterSetting.md)
- [monitorPrinter](monitorPrinter.md)
- [tryToConnectUntil](tryToConnectUntil.md)

## Content methods

- [addText](addText.md)
- [addTextLine](addTextLine.md)
- [addFeedLine](addFeedLine.md)
- [addCut](addCut.md)
- [addImage](addImage.md)
- [addBarcode](addBarcode.md)
- [addSymbol](addSymbol.md)
- [addPulse](addPulse.md)
- [addCommand](addCommand.md)

## Advanced methods

- [addTextAlign](addTextAlign.md)
- [addTextLang](addTextLang.md)
- [addTextSize](addTextSize.md)
- [addTextStyle](addTextStyle.md)
- [addTextSmooth](addTextSmooth.md)
- [addTextLine](addTextLine.md)
- [addViewShot](addViewShot.md)

## Notes

- Always use `target` from discovery/EasySelect.
- Keep disconnect in `finally` blocks.
- Validate advanced command parity on target hardware.
