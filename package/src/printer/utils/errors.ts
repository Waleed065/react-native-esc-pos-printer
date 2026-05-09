import { PrinterError } from '../../core';
import {
  PrinterErrorResult,
  PrinterErrorStatusMapping,
} from '../constants';
import type { ComplexErrorData, ComplexErrorRawData } from '../types';

export function throwProcessedError({
  methodName,
  errorCode,
  messagesMapping,
  statusMapping = PrinterErrorStatusMapping,
}: {
  methodName: string;
  errorCode: string;
  messagesMapping: Record<string | number, string | undefined>;
  statusMapping?: Record<string | number, string | undefined>;
}): never {
  const result = !isNaN(Number(errorCode))
    ? errorCode
    : PrinterErrorResult.ERR_FAILURE;
  const resultKey = String(result);

  const fallbackKey = String(PrinterErrorResult.ERR_FAILURE);
  const message =
    messagesMapping[resultKey] ??
    messagesMapping[fallbackKey] ??
    'An unknown error occurred.';
  const status =
    statusMapping[resultKey] ??
    statusMapping[fallbackKey] ??
    'ERR_FAILURE';

  throw new PrinterError({
    status,
    message,
    methodName,
  });
}

export function processComplextError(message: string): ComplexErrorData {
  try {
    const { type, data } = JSON.parse(message) as ComplexErrorRawData;

    return { errorType: type, data: String(data) };
  } catch {
    return {
      errorType: 'result',
      data: message,
    };
  }
}
