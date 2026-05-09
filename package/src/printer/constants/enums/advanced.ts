import { EscPosPrinter } from '../../../specs';

const EscPosPrinterConstants = EscPosPrinter.getConstants();

export enum PrinterLineStyleType {
  LINE_THIN = EscPosPrinterConstants.LINE_THIN,
  LINE_MEDIUM = EscPosPrinterConstants.LINE_MEDIUM,
  LINE_THICK = EscPosPrinterConstants.LINE_THICK,
  LINE_THIN_DOUBLE = EscPosPrinterConstants.LINE_THIN_DOUBLE,
  LINE_MEDIUM_DOUBLE = EscPosPrinterConstants.LINE_MEDIUM_DOUBLE,
  LINE_THICK_DOUBLE = EscPosPrinterConstants.LINE_THICK_DOUBLE,
}

export enum PrinterDirectionType {
  DIRECTION_LEFT_TO_RIGHT = EscPosPrinterConstants.DIRECTION_LEFT_TO_RIGHT,
  DIRECTION_BOTTOM_TO_TOP = EscPosPrinterConstants.DIRECTION_BOTTOM_TO_TOP,
  DIRECTION_RIGHT_TO_LEFT = EscPosPrinterConstants.DIRECTION_RIGHT_TO_LEFT,
  DIRECTION_TOP_TO_BOTTOM = EscPosPrinterConstants.DIRECTION_TOP_TO_BOTTOM,
}

export enum PrinterSoundPatternType {
  PATTERN_NONE = EscPosPrinterConstants.PATTERN_NONE,
  PATTERN_A = EscPosPrinterConstants.PATTERN_A,
  PATTERN_B = EscPosPrinterConstants.PATTERN_B,
  PATTERN_C = EscPosPrinterConstants.PATTERN_C,
  PATTERN_D = EscPosPrinterConstants.PATTERN_D,
  PATTERN_E = EscPosPrinterConstants.PATTERN_E,
  PATTERN_ERROR = EscPosPrinterConstants.PATTERN_ERROR,
  PATTERN_PAPER_EMPTY = EscPosPrinterConstants.PATTERN_PAPER_EMPTY,
  PATTERN_1 = EscPosPrinterConstants.PATTERN_1,
  PATTERN_2 = EscPosPrinterConstants.PATTERN_2,
  PATTERN_3 = EscPosPrinterConstants.PATTERN_3,
  PATTERN_4 = EscPosPrinterConstants.PATTERN_4,
  PATTERN_5 = EscPosPrinterConstants.PATTERN_5,
  PATTERN_6 = EscPosPrinterConstants.PATTERN_6,
  PATTERN_7 = EscPosPrinterConstants.PATTERN_7,
  PATTERN_8 = EscPosPrinterConstants.PATTERN_8,
  PATTERN_9 = EscPosPrinterConstants.PATTERN_9,
  PATTERN_10 = EscPosPrinterConstants.PATTERN_10,
}

export enum PrinterFeedPositionType {
  FEED_PEELING = EscPosPrinterConstants.FEED_PEELING,
  FEED_CUTTING = EscPosPrinterConstants.FEED_CUTTING,
  FEED_CURRENT_TOF = EscPosPrinterConstants.FEED_CURRENT_TOF,
  FEED_NEXT_TOF = EscPosPrinterConstants.FEED_NEXT_TOF,
}

export enum PrinterLayoutType {
  LAYOUT_RECEIPT = EscPosPrinterConstants.LAYOUT_RECEIPT,
  LAYOUT_RECEIPT_BM = EscPosPrinterConstants.LAYOUT_RECEIPT_BM,
  LAYOUT_LABEL = EscPosPrinterConstants.LAYOUT_LABEL,
  LAYOUT_LABEL_BM = EscPosPrinterConstants.LAYOUT_LABEL_BM,
}
