import { PrinterWrapper } from './PrinterWrapper';
import { PrinterGetSettingsType, PrinterModelLang } from './constants';
import {
  addTextLine,
  addViewShot,
  monitorPrinter,
  tryToConnectUntil,
} from './printHelpers';
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
  PrinterParams,
} from './types';

export class Printer {
  public readonly deviceName: string;
  private readonly lang: PrinterModelLang;
  private readonly printerWrapper: PrinterWrapper;

  constructor({
    target,
    deviceName,
    lang = PrinterModelLang.MODEL_ANK,
  }: PrinterParams) {
    this.deviceName = deviceName;
    this.lang = lang;
    this.printerWrapper = new PrinterWrapper(target);
  }

  static addTextLine = addTextLine;
  static monitorPrinter = monitorPrinter;
  static tryToConnectUntil = tryToConnectUntil;
  static addViewShot = addViewShot;

  get currentFontWidth() {
    return this.printerWrapper.currentFontWidth;
  }

  init = () => {
    return this.printerWrapper.init({
      deviceName: this.deviceName,
      lang: this.lang,
    });
  };

  connect = async (timeout?: number) => {
    await this.init();
    return this.printerWrapper.connect(timeout);
  };

  disconnect = () => {
    return this.printerWrapper.disconnect();
  };

  addText = (data: string) => {
    return this.printerWrapper.addText(data);
  };

  beginTransaction = () => {
    return this.printerWrapper.beginTransaction();
  };

  endTransaction = () => {
    return this.printerWrapper.endTransaction();
  };

  addFeedLine = (line?: number) => {
    return this.printerWrapper.addFeedLine(line);
  };

  addTextRotate = (rotate?: AddTextRotateParam) => {
    return this.printerWrapper.addTextRotate(rotate);
  };

  addTextFont = (font?: AddTextFontParam) => {
    return this.printerWrapper.addTextFont(font);
  };

  addHPosition = (x: AddHPositionParam) => {
    return this.printerWrapper.addHPosition(x);
  };

  addFeedUnit = (unit: AddFeedUnitParam) => {
    return this.printerWrapper.addFeedUnit(unit);
  };

  addLineSpace = (linespc: number) => {
    return this.printerWrapper.addLineSpace(linespc);
  };

  sendData = (timeout?: number) => {
    return this.printerWrapper.sendData(timeout);
  };

  addCut = (type?: AddCutTypeParam) => {
    return this.printerWrapper.addCut(type);
  };

  getPrinterSetting = (type: PrinterGetSettingsType, timeout?: number) => {
    return this.printerWrapper.getPrinterSetting(type, timeout);
  };

  getStatus = () => {
    return this.printerWrapper.getStatus();
  };

  addImage = (params: AddImageParams) => {
    return this.printerWrapper.addImage(params);
  };

  addLogo = (params: AddLogoParams) => {
    return this.printerWrapper.addLogo(params);
  };

  addBarcode = (params: AddBarcodeParams) => {
    return this.printerWrapper.addBarcode(params);
  };

  addSymbol = (params: AddSymbolParams) => {
    return this.printerWrapper.addSymbol(params);
  };

  addPageBegin = () => {
    return this.printerWrapper.addPageBegin();
  };

  addPageEnd = () => {
    return this.printerWrapper.addPageEnd();
  };

  addPageArea = (params: AddPageAreaParams) => {
    return this.printerWrapper.addPageArea(params);
  };

  addPageDirection = (direction: AddPageDirectionParam) => {
    return this.printerWrapper.addPageDirection(direction);
  };

  addPagePosition = (params: AddPagePositionParams) => {
    return this.printerWrapper.addPagePosition(params);
  };

  addPageLine = (params: AddPageLineParams) => {
    return this.printerWrapper.addPageLine(params);
  };

  addPageRectangle = (params: AddPageRectangleParams) => {
    return this.printerWrapper.addPageRectangle(params);
  };

  addCommand = (uint8Array: Uint8Array) => {
    return this.printerWrapper.addCommand(uint8Array);
  };

  addPulse = (params: AddPulseParams) => {
    return this.printerWrapper.addPulse(params);
  };

  addSound = (params?: AddSoundParams) => {
    return this.printerWrapper.addSound(params);
  };

  addFeedPosition = (position?: AddFeedPositionParam) => {
    return this.printerWrapper.addFeedPosition(position);
  };

  addHLine = (params: AddHLineParams) => {
    return this.printerWrapper.addHLine(params);
  };

  addVLineBegin = (params: AddVLineBeginParams) => {
    return this.printerWrapper.addVLineBegin(params);
  };

  addVLineEnd = (lineId: number) => {
    return this.printerWrapper.addVLineEnd(lineId);
  };

  addLayout = (params: AddLayoutParams) => {
    return this.printerWrapper.addLayout(params);
  };

  addRotateBegin = () => {
    return this.printerWrapper.addRotateBegin();
  };

  addRotateEnd = () => {
    return this.printerWrapper.addRotateEnd();
  };

  addTextAlign = (params?: AddTextAlignParam) => {
    return this.printerWrapper.addTextAlign(params);
  };

  addTextSize = async (params?: AddTextSizeParams) => {
    await this.printerWrapper.addTextSize(params);
  };

  addTextSmooth = (smooth?: AddTextSmoothParam) => {
    return this.printerWrapper.addTextSmooth(smooth);
  };

  addTextStyle = (params?: AddTextStyleParams) => {
    return this.printerWrapper.addTextStyle(params);
  };

  addTextLang = (lang: AddTextLangParam) => {
    return this.printerWrapper.addTextLang(lang);
  };

  clearCommandBuffer = () => {
    return this.printerWrapper.clearCommandBuffer();
  };
}
