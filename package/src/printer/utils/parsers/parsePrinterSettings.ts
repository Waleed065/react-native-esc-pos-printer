import {
  PrinterGetSettingsType,
  GetPrinterSettingsPaperWidthValuesMapping,
  GetPrinterSettingsPrintDencityValuesMapping,
  GetPrinterSettingsPrintSpeendValuesMapping,
} from '../../constants';
import type {
  PrinterSettingsResponse,
  PrinterSettingsRawResponse,
} from '../../types';

export function parsePrinterSettings(
  response: PrinterSettingsRawResponse
): PrinterSettingsResponse {
  let valueMapping: Record<number, number> = GetPrinterSettingsPaperWidthValuesMapping;

  if (response.type === PrinterGetSettingsType.PRINTER_SETTING_PRINTDENSITY) {
    valueMapping = GetPrinterSettingsPrintDencityValuesMapping;
  } else if (
    response.type === PrinterGetSettingsType.PRINTER_SETTING_PRINTSPEED
  ) {
    valueMapping = GetPrinterSettingsPrintSpeendValuesMapping;
  }

  return {
    typeCode: response.type,
    type: PrinterGetSettingsType[response.type] ?? String(response.type),
    value: valueMapping[response.value] ?? response.value,
  };
}
