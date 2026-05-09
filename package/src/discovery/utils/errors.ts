import { PrinterDiscoveryError } from '../../core';
import {
  DiscoveryErrorMessageMapping,
  DiscoveryErrorStatusMapping,
  DiscoveryErrorResult,
} from '../constants';

export function getProcessedError({
  methodName,
  errorCode,
  messagesMapping = DiscoveryErrorMessageMapping,
  statusMapping = DiscoveryErrorStatusMapping,
}: {
  methodName: string;
  errorCode: string;
  messagesMapping?: Record<string, string | undefined>;
  statusMapping?: Record<string, string | undefined>;
}) {
  const result = !isNaN(Number(errorCode))
    ? errorCode
    : DiscoveryErrorResult.ERR_FAILURE;

  const fallbackKey = String(DiscoveryErrorResult.ERR_FAILURE);
  const message =
    messagesMapping[result] ??
    messagesMapping[fallbackKey] ??
    'An unknown error occurred.';
  const status = statusMapping[result] ?? statusMapping[fallbackKey] ?? 'ERR_FAILURE';

  return new PrinterDiscoveryError({
    status,
    message,
    methodName,
  });
}
