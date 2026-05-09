import { EscPosPrinterEasySelect } from '../specs';
import {
  EasySelectParseTimeout,
} from './constants';
import type {
  EasySelectCreateQROptions,
  EasySelectInfo,
  EasySelectParseBeaconOptions,
  EasySelectParseNFCOptions,
} from './types';

function getStringField(
  input: Record<string, unknown>,
  key: string
): string | undefined {
  const value = input[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function parseInfo(input: unknown): EasySelectInfo {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Invalid EasySelect response: expected an object.');
  }

  const info = input as Record<string, unknown>;
  const deviceType = info.deviceType;

  if (typeof deviceType !== 'number') {
    throw new Error('Invalid EasySelect response: missing numeric deviceType.');
  }

  return {
    deviceType,
    printerName: getStringField(info, 'printerName') ?? '',
    macAddress: getStringField(info, 'macAddress') ?? '',
    target: getStringField(info, 'target'),
    serialNumber: getStringField(info, 'serialNumber'),
    ssid: getStringField(info, 'ssid'),
    passphrase: getStringField(info, 'passphrase'),
  };
}

function parseInfoArray(input: unknown): EasySelectInfo[] {
  if (!Array.isArray(input)) {
    throw new Error('Invalid EasySelect response: expected an array.');
  }

  return input.map((item) => parseInfo(item));
}

export class EasySelect {
  static async createQR({
    printerName,
    deviceType,
    macAddress,
  }: EasySelectCreateQROptions): Promise<string> {
    return EscPosPrinterEasySelect.createQR(printerName, deviceType, macAddress);
  }

  static async parseQR(data: string): Promise<EasySelectInfo> {
    const parsed = await EscPosPrinterEasySelect.parseQR(data);
    return parseInfo(parsed);
  }

  static async parseNFC(
    options?: EasySelectParseNFCOptions
  ): Promise<EasySelectInfo[]> {
    const timeout = options?.timeout ?? EasySelectParseTimeout.DEFAULT;
    const parsed = await EscPosPrinterEasySelect.parseNFC(timeout);

    return parseInfoArray(parsed);
  }

  static async parseBeacon({
    uuid,
    major,
    minor,
    timeout,
  }: EasySelectParseBeaconOptions): Promise<EasySelectInfo> {
    const parsed = await EscPosPrinterEasySelect.parseBeacon(
      uuid,
      major ?? -1,
      minor ?? -1,
      timeout ?? 5000
    );

    return parseInfo(parsed);
  }
}
