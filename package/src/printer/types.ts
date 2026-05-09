import type {
  PrinterModelLang,
  ColorType,
  ImageCompressType,
  ImageHalftoneType,
  ImageColorModeType,
  PrinterAddCutType,
  FontType,
  BarcodeType,
  BarcodeHRI,
  PrinterAddPulseDrawerType,
  PrinterAddPulseTimeType,
  PrinterDirectionType,
  PrinterFeedPositionType,
  PrinterLayoutType,
  PrinterLineStyleType,
  PrinterSoundPatternType,
  TextAlignType,
  CommonParams,
  TextLangType,
} from './constants';

import { SymbolLevel, SymbolType } from './constants/enums/symbol';

export type PrinterParams = {
  target: string;
  deviceName: string;
  lang?: PrinterModelLang;
};

export type PrinterInitParams = {
  deviceName: string;
  lang: PrinterModelLang;
};

export type PrinterSettingsRawResponse = {
  type: number;
  value: number;
};

export type PrinterSettingsResponse = {
  typeCode: number;
  type: string;
  value: number;
};

export type ComplexErrorRawData = {
  type: 'code' | 'result';
  data: number;
};

export type ComplexErrorData = {
  errorType: 'code' | 'result';
  data: string;
};

export type PrinterStatusProperties =
  | 'connection'
  | 'online'
  | 'coverOpen'
  | 'paper'
  | 'paperFeed'
  | 'panelSwitch'
  | 'drawer'
  | 'errorStatus'
  | 'autoRecoverError'
  | 'buzzer'
  | 'adapter'
  | 'batteryLevel'
  | 'removalWaiting'
  | 'paperTakenSensor'
  | 'unrecoverError';

export type DefaultOrUnspecifiedParam =
  | CommonParams.PARAM_DEFAULT
  | CommonParams.PARAM_UNSPECIFIED;

export type TrueFalseParam = CommonParams.TRUE | CommonParams.FALSE;

export type PrinterStatusRawResponse = Record<PrinterStatusProperties, string>;
export type PrinterStatusResponse = Record<
  PrinterStatusProperties,
  { status: string; message: string; statusCode: number }
>;

export type ImageSource =
  | number
  | {
      uri: string;
    };

export type AddImageParams = {
  source: ImageSource;
  width: number;
  color?: ColorType | CommonParams.PARAM_DEFAULT;
  mode?: ImageColorModeType | CommonParams.PARAM_DEFAULT;
  halftone?: ImageHalftoneType | CommonParams.PARAM_DEFAULT;
  brightness?: number | CommonParams.PARAM_DEFAULT;
  compress?: ImageCompressType | CommonParams.PARAM_DEFAULT;
};

export type AddBarcodeParams = {
  data: string;
  type: BarcodeType;
  hri?: BarcodeHRI | DefaultOrUnspecifiedParam;
  font?: FontType | DefaultOrUnspecifiedParam;
  width?: number | CommonParams.PARAM_UNSPECIFIED;
  height?: number | CommonParams.PARAM_UNSPECIFIED;
};

export type AddSymbolParams = {
  type: SymbolType;
  width?: number;
  data: string;
  level?: SymbolLevel | DefaultOrUnspecifiedParam;
  height?: number;
  size: number;
};

export type AddCutTypeParam = PrinterAddCutType | CommonParams.PARAM_DEFAULT;

export interface AddPulseParams {
  drawer?: PrinterAddPulseDrawerType | CommonParams.PARAM_DEFAULT;
  time?: PrinterAddPulseTimeType | CommonParams.PARAM_DEFAULT;
}

export type AddTextAlignParam = TextAlignType | CommonParams.PARAM_DEFAULT;
export type AddTextSizeParams = {
  width?: number | DefaultOrUnspecifiedParam;
  height?: number | DefaultOrUnspecifiedParam;
};

export type AddTextSmoothParam = TrueFalseParam | CommonParams.PARAM_DEFAULT;

export type AddTextRotateParam = TrueFalseParam | CommonParams.PARAM_DEFAULT;

export type AddTextFontParam = FontType | CommonParams.PARAM_DEFAULT;

export type AddHPositionParam = number;

export type AddFeedUnitParam = number;

export type AddTextStyleParams = {
  reverse?: TrueFalseParam | DefaultOrUnspecifiedParam;
  ul?: TrueFalseParam | DefaultOrUnspecifiedParam;
  em?: TrueFalseParam | DefaultOrUnspecifiedParam;
  color?: ColorType | DefaultOrUnspecifiedParam;
};

export type AddLogoParams = {
  key1: number;
  key2: number;
};

export type AddPageAreaParams = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AddPageDirectionParam = PrinterDirectionType;

export type AddPagePositionParams = {
  x: number;
  y: number;
};

export type AddPageLineParams = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style: PrinterLineStyleType;
};

export type AddPageRectangleParams = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style: PrinterLineStyleType;
};

export interface AddSoundParams {
  pattern?: PrinterSoundPatternType | CommonParams.PARAM_DEFAULT;
  repeat?: number | CommonParams.PARAM_DEFAULT;
  cycle?: number | CommonParams.PARAM_DEFAULT;
}

export type AddFeedPositionParam =
  | PrinterFeedPositionType
  | CommonParams.PARAM_DEFAULT;

export type AddHLineParams = {
  x1: number;
  x2: number;
  style: PrinterLineStyleType;
};

export type AddVLineBeginParams = {
  x: number;
  style: PrinterLineStyleType;
};

export type AddLayoutParams = {
  type: PrinterLayoutType;
  width: number;
  height: number;
  marginTop?: number | CommonParams.PARAM_DEFAULT;
  marginBottom?: number | CommonParams.PARAM_DEFAULT;
  offsetCut?: number | CommonParams.PARAM_DEFAULT;
  offsetLabel?: number | CommonParams.PARAM_DEFAULT;
};

export interface SpaceBetweenParams {
  left: string;
  right: string;
  textToWrap?: 'right' | 'left';
  textToWrapWidth?: number;
  gapSymbol?: string;
  noTrim?: boolean;
}

export interface AddViewShotParams {
  viewNode: object | null;
  width?: number;
}

export type AddTextLangParam = TextLangType | CommonParams.PARAM_DEFAULT;
