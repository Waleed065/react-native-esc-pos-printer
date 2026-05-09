import { spaceBetween, getFontACharsPerLine } from '../utils';
import type { Printer } from '../Printer';
import type { SpaceBetweenParams } from '../types';
import { PrinterConstants, DEFAULT_PAPER_WIDTH } from '../constants';

export async function addTextLine(
  printer: Printer,
  params: SpaceBetweenParams,
  customCharsPerLine?: number
): Promise<void> {
  const printerCharsPerLinePerWidth = getFontACharsPerLine(printer.deviceName);
  const printerSettings = await printer.getPrinterSetting(
    PrinterConstants.PRINTER_SETTING_PAPERWIDTH
  );
  const paperWidth = printerSettings.value;

  const charsPerLine = customCharsPerLine
    ? customCharsPerLine
    : printerCharsPerLinePerWidth[paperWidth] ??
      printerCharsPerLinePerWidth[DEFAULT_PAPER_WIDTH] ??
      42;

  const text = spaceBetween(
    Math.ceil(charsPerLine / printer.currentFontWidth),
    params
  );

  await printer.addText(text);
}
