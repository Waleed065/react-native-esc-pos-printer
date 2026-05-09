import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import type { Spec as NativeEscPosPrinterSpec } from './NativeEscPosPrinter';
import type { Spec as NativeEscPosPrinterDiscoverySpec } from './NativeEscPosPrinterDiscovery';

type LegacyDiscoveryCallback = (printers: Array<Record<string, unknown>>) => void;

const globalRuntime = globalThis as typeof globalThis & {
  __turboModuleProxy?: unknown;
  RN$Bridgeless?: unknown;
};

const isTurboModuleEnabled =
  Boolean(globalRuntime.__turboModuleProxy) || Boolean(globalRuntime.RN$Bridgeless);

let EscPosPrinter: NativeEscPosPrinterSpec;
let EscPosPrinterDiscovery: NativeEscPosPrinterDiscoverySpec;

if (isTurboModuleEnabled) {
  EscPosPrinter = require('./NativeEscPosPrinter').default;
  EscPosPrinterDiscovery = require('./NativeEscPosPrinterDiscovery').default;
} else {
  const {
    EscPosPrinterDiscovery: OldArchEscPosPrinterDiscovery,
    EscPosPrinter: OldArchEscPosPrinter,
  } = NativeModules;
  const DiscoveryEventEmitter = new NativeEventEmitter(
    OldArchEscPosPrinterDiscovery
  );

  EscPosPrinterDiscovery = {
    ...NativeModules.EscPosPrinterDiscovery,
    onDiscovery: (callback: LegacyDiscoveryCallback) => {
      return DiscoveryEventEmitter.addListener(
        'onDiscovery',
        (...args: readonly unknown[]) => {
          const printers = (args[0] as Array<Record<string, unknown>>) ?? [];
          callback(printers);
        }
      );
    },
    ...(Platform.OS === 'android'
      ? {
          enableLocationSettingSuccess: (callback: () => void) => {
            return DiscoveryEventEmitter.addListener(
              'enableLocationSettingSuccess',
              callback
            );
          },
          enableLocationSettingFailure: (callback: () => void) => {
            return DiscoveryEventEmitter.addListener(
              'enableLocationSettingFailure',
              callback
            );
          },
        }
      : {}),
  };

  EscPosPrinter = OldArchEscPosPrinter as NativeEscPosPrinterSpec;
}

export { EscPosPrinter, EscPosPrinterDiscovery };
