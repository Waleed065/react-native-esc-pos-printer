import { Image } from 'react-native';
import {
  CommonOperationErrorMessageMapping,
  ConnectPrinterErrorMessageMapping,
  DisconnectPrinterErrorMessageMapping,
  InitPrinterErrorMessageMapping,
  PrinterErrorResult,
  PrintErrorCodeMessageMapping,
  PrinterConstants,
  PrinterErrorCodeStatusMapping,
  PrinterErrorStatusMapping,
  PrinterGetSettingsType,
  SendDataPrinterErrorMessageMapping,
} from './constants';
import type {
  AddBarcodeParams,
  AddCutTypeParam,
  AddFeedPositionParam,
  AddFeedUnitParam,
  AddHLineParams,
  AddHPositionParam,
  AddImageParams,
  AddLayoutParams,
  AddLogoParams,
  AddPageAreaParams,
  AddPageDirectionParam,
  AddPageLineParams,
  AddPagePositionParams,
  AddPageRectangleParams,
  AddPulseParams,
  AddSoundParams,
  AddSymbolParams,
  AddTextAlignParam,
  AddTextFontParam,
  AddTextLangParam,
  AddTextRotateParam,
  AddTextSizeParams,
  AddTextSmoothParam,
  AddTextStyleParams,
  AddVLineBeginParams,
  PrinterInitParams,
  PrinterSettingsRawResponse,
  PrinterSettingsResponse,
  PrinterStatusRawResponse,
  PrinterStatusResponse,
} from './types';
import {
  BufferHelper,
  parsePrinterSettings,
  parsePrinterStatus,
  processComplextError,
  throwProcessedError,
} from './utils';

import { EscPosPrinter } from '../specs';

function getErrorCode(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return String(error);
}

export class PrinterWrapper {
  private target: string;
  private printerPaperWidth: number | null = null;
  public currentFontWidth: number = 1;

  constructor(target: string) {
    this.target = target;
  }

  init = async ({ deviceName, lang }: PrinterInitParams): Promise<void> => {
    try {
      await EscPosPrinter.initWithPrinterDeviceName(
        this.target,
        deviceName,
        lang
      );
      this.currentFontWidth = 1;
    } catch (error) {
      throwProcessedError({
        methodName: 'init',
        errorCode: getErrorCode(error),
        messagesMapping: InitPrinterErrorMessageMapping,
      });
    }
  };

  connect = async (timeout: number = 15000): Promise<void> => {
    try {
      await EscPosPrinter.connect(this.target, timeout);
    } catch (error) {
      throwProcessedError({
        methodName: 'connect',
        errorCode: getErrorCode(error),
        messagesMapping: ConnectPrinterErrorMessageMapping,
      });
    }
  };

  disconnect = async (): Promise<void> => {
    try {
      await EscPosPrinter.disconnect(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'disconnect',
        errorCode: getErrorCode(error),
        messagesMapping: DisconnectPrinterErrorMessageMapping,
      });
    }
  };

  /**
   * Forcefully Clears the command buffer of the printer
   * Caution ☢️: Only use this method if disconnecting the printer is not an option.
   *
   * Disconnecting will automatically clear the command buffer.
   */
  clearCommandBuffer = async (): Promise<void> => {
    try {
      await EscPosPrinter.clearCommandBuffer(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'clearCommandBuffer',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addText = async (data: string): Promise<void> => {
    try {
      await EscPosPrinter.addText(this.target, data);
    } catch (error) {
      throwProcessedError({
        methodName: 'addText',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  beginTransaction = async (): Promise<void> => {
    try {
      await EscPosPrinter.beginTransaction(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'beginTransaction',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  endTransaction = async (): Promise<void> => {
    try {
      await EscPosPrinter.endTransaction(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'endTransaction',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addTextLang = async (lang: AddTextLangParam): Promise<void> => {
    try {
      await EscPosPrinter.addTextLang(this.target, lang);
    } catch (error) {
      throwProcessedError({
        methodName: 'addTextLang',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addFeedLine = async (line: number = 1): Promise<void> => {
    try {
      await EscPosPrinter.addFeedLine(this.target, line);
    } catch (error) {
      throwProcessedError({
        methodName: 'addFeedLine',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addTextRotate = async (
    rotate: AddTextRotateParam = PrinterConstants.FALSE
  ): Promise<void> => {
    try {
      await EscPosPrinter.addTextRotate(this.target, rotate);
    } catch (error) {
      throwProcessedError({
        methodName: 'addTextRotate',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addTextFont = async (
    font: AddTextFontParam = PrinterConstants.PARAM_DEFAULT
  ): Promise<void> => {
    try {
      await EscPosPrinter.addTextFont(this.target, font);
    } catch (error) {
      throwProcessedError({
        methodName: 'addTextFont',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addHPosition = async (x: AddHPositionParam): Promise<void> => {
    try {
      await EscPosPrinter.addHPosition(this.target, x);
    } catch (error) {
      throwProcessedError({
        methodName: 'addHPosition',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addFeedUnit = async (unit: AddFeedUnitParam): Promise<void> => {
    try {
      await EscPosPrinter.addFeedUnit(this.target, unit);
    } catch (error) {
      throwProcessedError({
        methodName: 'addFeedUnit',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addLineSpace = async (linespc: number): Promise<void> => {
    try {
      await EscPosPrinter.addLineSpace(this.target, linespc);
    } catch (error) {
      throwProcessedError({
        methodName: 'addLineSpace',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addCut = async (
    type: AddCutTypeParam = PrinterConstants.PARAM_DEFAULT
  ): Promise<void> => {
    try {
      await EscPosPrinter.addCut(this.target, type);
    } catch (error) {
      throwProcessedError({
        methodName: 'addCut',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  sendData = async (timeout: number = 5000): Promise<PrinterStatusResponse> => {
    try {
      const result = (await EscPosPrinter.sendData(
        this.target,
        timeout
      )) as PrinterStatusRawResponse;
      return parsePrinterStatus(result);
    } catch (error) {
      const { errorType, data } = processComplextError(getErrorCode(error));

      throwProcessedError({
        methodName: 'sendData',
        errorCode: data,
        messagesMapping:
          errorType === 'code'
            ? PrintErrorCodeMessageMapping
            : SendDataPrinterErrorMessageMapping,
        statusMapping:
          errorType === 'code'
            ? PrinterErrorCodeStatusMapping
            : PrinterErrorStatusMapping,
      });
    }
  };

  getPrinterSetting = async (
    type: PrinterGetSettingsType,
    timeout: number = 10000
  ): Promise<PrinterSettingsResponse> => {
    try {
      const isPrinterPaperWidthRequested =
        type === PrinterGetSettingsType.PRINTER_SETTING_PAPERWIDTH;

      if (isPrinterPaperWidthRequested && this.printerPaperWidth !== null) {
        return parsePrinterSettings({ type, value: this.printerPaperWidth });
      }

      const result = (await EscPosPrinter.getPrinterSetting(
        this.target,
        timeout,
        type
      )) as PrinterSettingsRawResponse;

      if (isPrinterPaperWidthRequested) {
        this.printerPaperWidth = result.value;
      }

      return parsePrinterSettings(result);
    } catch (error) {
      const { errorType, data } = processComplextError(getErrorCode(error));

      throwProcessedError({
        methodName: 'getPrinterSetting',
        errorCode: data,
        messagesMapping:
          errorType === 'code'
            ? PrintErrorCodeMessageMapping
            : CommonOperationErrorMessageMapping,
        statusMapping:
          errorType === 'code'
            ? PrinterErrorCodeStatusMapping
            : PrinterErrorStatusMapping,
      });
    }
  };

  getStatus = async (): Promise<PrinterStatusResponse> => {
    try {
      const result = (await EscPosPrinter.getStatus(
        this.target
      )) as PrinterStatusRawResponse;
      return parsePrinterStatus(result);
    } catch (error) {
      throwProcessedError({
        methodName: 'getStatus',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addImage = async ({
    source,
    width,
    color = PrinterConstants.PARAM_DEFAULT,
    mode = PrinterConstants.PARAM_DEFAULT,
    halftone = PrinterConstants.PARAM_DEFAULT,
    brightness = PrinterConstants.PARAM_DEFAULT,
    compress = PrinterConstants.PARAM_DEFAULT,
  }: AddImageParams): Promise<void> => {
    try {
      const resolvedSource = Image.resolveAssetSource(source);

      if (!resolvedSource) {
        throwProcessedError({
          methodName: 'addImage',
          errorCode: String(PrinterErrorResult.ERR_PARAM),
          messagesMapping: CommonOperationErrorMessageMapping,
        });
      }

      await EscPosPrinter.addImage(
        this.target,
        resolvedSource,
        width,
        color,
        mode,
        halftone,
        brightness,
        compress
      );
    } catch (error) {
      throwProcessedError({
        methodName: 'addImage',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addLogo = async ({ key1, key2 }: AddLogoParams): Promise<void> => {
    try {
      await EscPosPrinter.addLogo(this.target, key1, key2);
    } catch (error) {
      throwProcessedError({
        methodName: 'addLogo',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addBarcode = async ({
    data,
    type,
    hri = PrinterConstants.PARAM_DEFAULT,
    font = PrinterConstants.PARAM_DEFAULT,
    width = PrinterConstants.PARAM_UNSPECIFIED,
    height = PrinterConstants.PARAM_UNSPECIFIED,
  }: AddBarcodeParams): Promise<void> => {
    try {
      await EscPosPrinter.addBarcode(
        this.target,
        data,
        type,
        hri,
        font,
        width,
        height
      );
    } catch (error) {
      throwProcessedError({
        methodName: 'addBarcode',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addSymbol = async ({
    data,
    type,
    level = PrinterConstants.PARAM_DEFAULT,
    width,
    height,
    size,
  }: AddSymbolParams): Promise<void> => {
    try {
      await EscPosPrinter.addSymbol(
        this.target,
        data,
        type,
        level,
        width || size,
        height || size,
        size
      );
    } catch (error) {
      throwProcessedError({
        methodName: 'addSymbol',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPageBegin = async (): Promise<void> => {
    try {
      await EscPosPrinter.addPageBegin(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPageBegin',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPageEnd = async (): Promise<void> => {
    try {
      await EscPosPrinter.addPageEnd(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPageEnd',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPageArea = async ({
    x,
    y,
    width,
    height,
  }: AddPageAreaParams): Promise<void> => {
    try {
      await EscPosPrinter.addPageArea(this.target, x, y, width, height);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPageArea',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPageDirection = async (
    direction: AddPageDirectionParam
  ): Promise<void> => {
    try {
      await EscPosPrinter.addPageDirection(this.target, direction);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPageDirection',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPagePosition = async ({ x, y }: AddPagePositionParams): Promise<void> => {
    try {
      await EscPosPrinter.addPagePosition(this.target, x, y);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPagePosition',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPageLine = async ({
    x1,
    y1,
    x2,
    y2,
    style,
  }: AddPageLineParams): Promise<void> => {
    try {
      await EscPosPrinter.addPageLine(this.target, x1, y1, x2, y2, style);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPageLine',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPageRectangle = async ({
    x1,
    y1,
    x2,
    y2,
    style,
  }: AddPageRectangleParams): Promise<void> => {
    try {
      await EscPosPrinter.addPageRectangle(this.target, x1, y1, x2, y2, style);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPageRectangle',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addCommand = async (uint8Array: Uint8Array): Promise<void> => {
    try {
      const buffer = new BufferHelper();
      const base64String = buffer.bytesToString(uint8Array, 'base64');
      await EscPosPrinter.addCommand(this.target, base64String);
    } catch (error) {
      throwProcessedError({
        methodName: 'addCommand',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addPulse = async ({
    drawer = PrinterConstants.PARAM_DEFAULT,
    time = PrinterConstants.PARAM_DEFAULT,
  }: AddPulseParams = {}): Promise<void> => {
    try {
      await EscPosPrinter.addPulse(this.target, drawer, time);
    } catch (error) {
      throwProcessedError({
        methodName: 'addPulse',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addSound = async ({
    pattern = PrinterConstants.PARAM_DEFAULT,
    repeat = PrinterConstants.PARAM_DEFAULT,
    cycle = PrinterConstants.PARAM_DEFAULT,
  }: AddSoundParams = {}): Promise<void> => {
    try {
      await EscPosPrinter.addSound(this.target, pattern, repeat, cycle);
    } catch (error) {
      throwProcessedError({
        methodName: 'addSound',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addFeedPosition = async (
    position: AddFeedPositionParam = PrinterConstants.PARAM_DEFAULT
  ): Promise<void> => {
    try {
      await EscPosPrinter.addFeedPosition(this.target, position);
    } catch (error) {
      throwProcessedError({
        methodName: 'addFeedPosition',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addHLine = async ({ x1, x2, style }: AddHLineParams): Promise<void> => {
    try {
      await EscPosPrinter.addHLine(this.target, x1, x2, style);
    } catch (error) {
      throwProcessedError({
        methodName: 'addHLine',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addVLineBegin = async ({
    x,
    style,
  }: AddVLineBeginParams): Promise<number> => {
    try {
      const lineId = await EscPosPrinter.addVLineBegin(this.target, x, style);
      return lineId;
    } catch (error) {
      throwProcessedError({
        methodName: 'addVLineBegin',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addVLineEnd = async (lineId: number): Promise<void> => {
    try {
      await EscPosPrinter.addVLineEnd(this.target, lineId);
    } catch (error) {
      throwProcessedError({
        methodName: 'addVLineEnd',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addLayout = async ({
    type,
    width,
    height,
    marginTop = PrinterConstants.PARAM_DEFAULT,
    marginBottom = PrinterConstants.PARAM_DEFAULT,
    offsetCut = PrinterConstants.PARAM_DEFAULT,
    offsetLabel = PrinterConstants.PARAM_DEFAULT,
  }: AddLayoutParams): Promise<void> => {
    try {
      await EscPosPrinter.addLayout(
        this.target,
        type,
        width,
        height,
        marginTop,
        marginBottom,
        offsetCut,
        offsetLabel
      );
    } catch (error) {
      throwProcessedError({
        methodName: 'addLayout',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addRotateBegin = async (): Promise<void> => {
    try {
      await EscPosPrinter.addRotateBegin(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'addRotateBegin',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addRotateEnd = async (): Promise<void> => {
    try {
      await EscPosPrinter.addRotateEnd(this.target);
    } catch (error) {
      throwProcessedError({
        methodName: 'addRotateEnd',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addTextAlign = async (
    align: AddTextAlignParam = PrinterConstants.PARAM_DEFAULT
  ): Promise<void> => {
    try {
      await EscPosPrinter.addTextAlign(this.target, align);
    } catch (error) {
      throwProcessedError({
        methodName: 'addTextAlign',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addTextSize = async ({
    width = PrinterConstants.PARAM_DEFAULT,
    height = PrinterConstants.PARAM_DEFAULT,
  }: AddTextSizeParams = {}): Promise<void> => {
    try {
      await EscPosPrinter.addTextSize(this.target, width, height);

      this.currentFontWidth = width || this.currentFontWidth;
    } catch (error) {
      throwProcessedError({
        methodName: 'addTextSize',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addTextSmooth = async (
    smooth: AddTextSmoothParam = PrinterConstants.TRUE
  ): Promise<void> => {
    try {
      await EscPosPrinter.addTextSmooth(this.target, smooth);
    } catch (error) {
      throwProcessedError({
        methodName: 'addTextSmooth',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };

  addTextStyle = async ({
    color = PrinterConstants.PARAM_DEFAULT,
    em = PrinterConstants.PARAM_DEFAULT,
    reverse = PrinterConstants.PARAM_DEFAULT,
    ul = PrinterConstants.PARAM_DEFAULT,
  }: AddTextStyleParams = {}): Promise<void> => {
    try {
      await EscPosPrinter.addTextStyle(this.target, reverse, ul, em, color);
    } catch (error) {
      throwProcessedError({
        methodName: 'addTextStyle',
        errorCode: getErrorCode(error),
        messagesMapping: CommonOperationErrorMessageMapping,
      });
    }
  };
}
