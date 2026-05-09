# Hook API: usePrintersDiscovery

`usePrintersDiscovery()` provides stateful discovery controls for React components.

## Returns

### `start(params?: DiscoveryStartParams): Promise<void>`

Starts discovery. If already discovering, repeated starts are ignored.

Platform behavior:

- Android: requests required runtime permissions and may trigger location-settings resolution.
- iOS: starts discovery without the Android location-settings dialog flow.

Example:

```ts
start({
  timeout: 8000,
  autoStop: true,
  filterOption: {
    portType: DiscoveryPortType.PORTTYPE_TCP,
  },
});
```

### `stop(): Promise<void>`

Stops discovery.

### `printers: DeviceInfo[]`

Current discovered devices list.

### `isDiscovering: boolean`

`true` while discovery is active.

### `printerError: PrinterDiscoveryError | null`

Last discovery error, if any.

### `pairBluetoothDevice(macAddress?: string): Promise<void>` (iOS-only behavior)

Requests Bluetooth pairing dialog/operation on iOS.
On Android this resolves without pairing flow (no-op).

## Types

- [DiscoveryStartParams](../interfaces/discoveryStartParams.md)
- [DeviceInfo](../interfaces/deviceInfo.md)
- [PrinterDiscoveryError](../interfaces/printerDiscoveryError.md)

## Usage pattern

```tsx
import { usePrintersDiscovery } from "react-native-esc-pos-printer";

const {
  start,
  stop,
  printers,
  isDiscovering,
  printerError,
  pairBluetoothDevice,
} = usePrintersDiscovery();
```
