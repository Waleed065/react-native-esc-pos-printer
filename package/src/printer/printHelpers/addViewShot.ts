import { Platform } from 'react-native';
import type { Printer } from '../Printer';

import type { AddViewShotParams } from '../types';
import { PrinterConstants, FULL_IMAGE_WIDTH_RATIO } from '../constants';

type CaptureRef = (
  viewNode: AddViewShotParams['viewNode'],
  options: { result: 'base64' }
) => Promise<string>;

export async function addViewShot(
  printer: Printer,
  { width, viewNode }: AddViewShotParams
): Promise<void> {
  let captureRef: CaptureRef | null = null;

  try {
    const RNViewShot = require('react-native-view-shot') as {
      captureRef?: CaptureRef;
    };

    captureRef = RNViewShot.captureRef ?? null;
  } catch {
    // Optional dependency.
  }

  if (!captureRef) {
    console.error('Install react-native-view-shot to use addViewShot');

    return;
  }

  if (!viewNode) {
    throw new Error('addViewShot requires a non-null viewNode reference.');
  }

  const printerSettings = await printer.getPrinterSetting(
    PrinterConstants.PRINTER_SETTING_PAPERWIDTH
  );
  const paperWidth = printerSettings.value;

  const imageBase64Uri = await captureRef(viewNode, {
    result: 'base64',
  });

  await printer.addImage({
    source: {
      uri: 'data:image/png;base64,' + imageBase64Uri,
    },
    color: PrinterConstants.COLOR_4,
    mode: PrinterConstants.MODE_GRAY16,
    halftone: PrinterConstants.HALFTONE_THRESHOLD,
    brightness: Platform.OS === 'ios' ? 0.3 : 0.1,
    width: width ?? FULL_IMAGE_WIDTH_RATIO * paperWidth,
  });
}
