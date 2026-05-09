import { EscPosPrinterEasySelect } from '../specs';

const EasySelectModuleConstants = EscPosPrinterEasySelect.getConstants();

export enum EasySelectDeviceType {
  TCP = EasySelectModuleConstants.DEVICE_TYPE_TCP,
  BLUETOOTH = EasySelectModuleConstants.DEVICE_TYPE_BLUETOOTH,
}

export const EasySelectParseTimeout = {
  DEFAULT: EasySelectModuleConstants.PARSE_NFC_TIMEOUT_DEFAULT,
} as const;
