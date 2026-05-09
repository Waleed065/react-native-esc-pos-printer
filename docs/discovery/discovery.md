# Discovery

This package offers two discovery styles:

1. Hook-based: [usePrintersDiscovery](usePrintersDiscovery.md)
2. Class-based: [PrintersDiscovery](PrintersDiscovery.md)

Both styles support transport filtering, timeout control, and error reporting.

## Platform notes

- `PORTTYPE_BLUETOOTH_LE` is iOS-only.
- On iOS, Bluetooth pairing helper is available via `pairBluetoothDevice`.
- On Android, `pairBluetoothDevice` resolves as a no-op.
- Discovery start can trigger Android location-settings resolution on supported API levels.
- iOS does not require the Android location-settings flow.
- On Android, runtime permissions are required by API level.
- Android simulator is not valid hardware coverage for printer discovery.

## Minimal hook example

```tsx
import { useEffect } from "react";
import { usePrintersDiscovery } from "react-native-esc-pos-printer";

export function DiscoveryExample() {
  const { start, stop, printers, isDiscovering, printerError } =
    usePrintersDiscovery();

  useEffect(() => {
    start({ timeout: 10000, autoStop: true });
    return () => {
      stop();
    };
  }, [start, stop]);

  return null;
}
```

## Filter options

See [interfaces/filterOption.md](../interfaces/filterOption.md) for all filter fields.
