# Class API: PrintersDiscovery

`PrintersDiscovery` is the class-based alternative to the hook API.

## Methods

### `start(params?: DiscoveryStartParams): Promise<void>`

Starts discovery.

### `stop(): Promise<void>`

Stops discovery.

### `onDiscovery(listener): unsubscribe`

Subscribes to discovered-printer events.

Listener signature:

```ts
(printers: DeviceInfo[]) => void
```

### `onStatusChange(listener): unsubscribe`

Subscribes to discovery status events.

Status values:

- `discovering`
- `inactive`

### `onError(listener): unsubscribe`

Subscribes to discovery errors.

### `pairBluetoothDevice(macAddress?: string): Promise<void>`

iOS helper for Bluetooth pairing.
On Android, this resolves without starting an OS pairing flow.

## Platform behavior

- `start()` runs the Android permission/location-settings path where required by API level.
- iOS does not use the Android location-settings dialog flow.

## Example

```ts
import { PrintersDiscovery } from "react-native-esc-pos-printer";

const removeDiscovery = PrintersDiscovery.onDiscovery((printers) => {
  console.log(printers);
});

const removeStatus = PrintersDiscovery.onStatusChange((status) => {
  console.log(status);
});

const removeError = PrintersDiscovery.onError((error) => {
  console.log(error);
});

await PrintersDiscovery.start({ timeout: 10000, autoStop: true });

// Later
await PrintersDiscovery.stop();
removeDiscovery();
removeStatus();
removeError();
```

## See also

- [Discovery overview](discovery.md)
- [Hook API](usePrintersDiscovery.md)
