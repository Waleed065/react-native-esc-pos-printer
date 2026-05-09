import {
  GetPrinterStatusMessageMapping,
  PrinterStatusMapping,
} from '../../constants';
import type {
  PrinterStatusRawResponse,
  PrinterStatusResponse,
} from '../../types';

export function parsePrinterStatus(
  response: PrinterStatusRawResponse
): PrinterStatusResponse {
  const properties = Object.keys(response) as Array<keyof PrinterStatusRawResponse>;

  return properties.reduce((acc, propName) => {
    const statusCode = response[propName];
    const message =
      GetPrinterStatusMessageMapping[propName][statusCode] ??
      'Status is unknown.';
    const status = PrinterStatusMapping[propName][statusCode] ?? 'UNKNOWN';
    acc[propName] = { status, message, statusCode: Number(statusCode) };
    return acc;
  }, {} as PrinterStatusResponse);
}
