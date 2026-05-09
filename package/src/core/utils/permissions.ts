import { PermissionsAndroid, Platform } from 'react-native';

import type { EventSubscription, Permission } from 'react-native';
import { EscPosPrinterDiscovery } from '../../specs';

const platformVersion = Platform.Version as number;
export async function requestAndroidPermissions(): Promise<boolean> {
  if (platformVersion < 23) return true;

  let permissions: Permission[] = [];

  if (platformVersion >= 31) {
    const permissionBluetoothScanGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    );

    const permissionBluetoothConnectGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    );

    if (!permissionBluetoothScanGranted) {
      permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
    }

    if (!permissionBluetoothConnectGranted) {
      permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
    }
  } else if (platformVersion >= 29 && platformVersion <= 30) {
    const permissionFineLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (!permissionFineLocationGranted) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  } else {
    const permissionCoarseLocationGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );

    if (!permissionCoarseLocationGranted) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    }
  }

  if (permissions.length > 0) {
    const status = await PermissionsAndroid.requestMultiple(permissions);
    return Object.keys(status ?? {}).every(
      (key) => status[key as Permission] === PermissionsAndroid.RESULTS.GRANTED
    );
  }

  return true;
}

export function enableLocationAccessAndroid10() {
  if (platformVersion > 28) {
    let successListener: EventSubscription | null;
    let errorListener: EventSubscription | null;
    let isSettled = false;

    function removeListeners() {
      successListener?.remove();
      errorListener?.remove();

      successListener = null;
      errorListener = null;
    }

    function resolveOnce(resolve: (value: boolean) => void) {
      if (isSettled) return;
      isSettled = true;
      removeListeners();
      resolve(true);
    }

    function rejectOnce(reject: (reason?: boolean) => void) {
      if (isSettled) return;
      isSettled = true;
      removeListeners();
      reject(false);
    }

    return new Promise((res, rej) => {
      successListener = EscPosPrinterDiscovery.enableLocationSettingSuccess(
        () => {
          resolveOnce(res);
        }
      );

      errorListener = EscPosPrinterDiscovery.enableLocationSettingFailure(
        () => {
          rejectOnce(rej);
        }
      );

      EscPosPrinterDiscovery.enableLocationSetting()
        .then(() => {
          resolveOnce(res);
        })
        .catch(() => {
          rejectOnce(rej);
        });
    });
  }

  return Promise.resolve(true);
}
