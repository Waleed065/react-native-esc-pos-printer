import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly getConstants: () => {
    DEVICE_TYPE_TCP: number;
    DEVICE_TYPE_BLUETOOTH: number;
    PARSE_NFC_TIMEOUT_DEFAULT: number;
  };

  createQR(printerName: string, deviceType: number, macAddress: string): Promise<string>;
  parseQR(data: string): Promise<Object>;
  parseNFC(timeout: number): Promise<Array<Object>>;
  parseBeacon(
    uuid: string,
    major: number,
    minor: number,
    timeout: number
  ): Promise<Object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('EscPosPrinterEasySelect');
