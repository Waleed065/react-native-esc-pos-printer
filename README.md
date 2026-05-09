<p align="center">
  <img src="./docs/assets/printer.png"
     alt="Printer"
/>
</p>

|  [![npm version](https://badge.fury.io/js/react-native-esc-pos-printer.svg)](https://badge.fury.io/js/react-native-esc-pos-printer)  |
|---|

## Features
 - Printer-only fork: Epson printer discovery, EasySelect, and print-command APIs
 - Supports **LAN/TCP**, **Bluetooth Classic**, and **USB** printer flows
 - `PORTTYPE_BLUETOOTH_LE` discovery filter is **iOS only**
 - Supports Android ABIs: **armeabi-v7a**, **arm64-v8a**, **x86**, **x86_64**
 - Focused on **Epson ePOS iOS/Android SDK integration (v2.36.0)**
 - Print receipts natively and from React Native views
 - Android integration is **New Architecture (TurboModule) only**
 - iOS integration uses Epson **dynamic** `libepos2.xcframework`
 - Includes typed **EasySelect** `createQR`/`parseQR`/`parseNFC`/`parseBeacon` APIs
 - **Clear errors descriptions**
 - Proxy-like API makes it **easy to add new commands**

> [!NOTE]
> BLE parsing/ranging parity: `parseBeacon` is currently iOS-only. Android returns unsupported for beacon parsing.


## Installation

### React Native

> [!WARNING]  
> For react-native lower than 0.76.x version, use react-native-esc-pos-printer 4.3.3 or lower

```sh
yarn add react-native-esc-pos-printer
```

> [!IMPORTANT]
> This fork requires React Native New Architecture on Android.
> In your app `android/gradle.properties`, set `newArchEnabled=true`.
>
> iOS minimum deployment target is **15.0**.

### Expo

```sh
npx expo install react-native-esc-pos-printer
npx expo prebuild
```

### Also complete [this required steps](./docs/INSTALLATION.md)

> [!IMPORTANT]
> If you use EasySelect `parseNFC` or `parseBeacon` on iOS, additional Info.plist permissions are required.
> See [docs/INSTALLATION.md](./docs/INSTALLATION.md#ios-easyselect-permissions).

## Usage

### Discover printers

```tsx
import { usePrintersDiscovery } from 'react-native-esc-pos-printer';

function App() {
  const { start, isDiscovering, printers } =
    usePrintersDiscovery();

    useEffect(() => {
      start();
    }, []);
}
```

### Print

```tsx
import { Printer } from 'react-native-esc-pos-printer';

function App() {
  const { start, isDiscovering, printers } =
    usePrintersDiscovery();

    useEffect(() => {
      start();
    }, []);

    const print = async () => {
      // printing on all discovered printers
      for (const printerData of printers) {
        const printerInstance = new Printer({
          target: printerData.target,
          deviceName: printerData.deviceName,
        });

        try {
          await Printer.tryToConnectUntil(
            printerInstance,
            (status) => status.online.statusCode === PrinterConstants.TRUE
          );
          await printerInstance.addText('DUDE!');
          await printerInstance.addFeedLine();
          await printerInstance.addCut();
          await printerInstance.sendData();
        } finally {
          await printerInstance.disconnect();
        }
      }
    }

  return <Button title="Print" onPress={print} />;
}

```

### Target string expectations

Always use the exact `target` emitted by discovery/EasySelect parsing.
Do not manually construct or normalize the `target` string.

Common examples you will see:

- `TCP:192.168.0.10`
- `BT:AA:BB:CC:DD:EE:FF`
- `USB:...` (platform-specific descriptor)

The exact format is SDK-controlled and can differ by transport/platform.

## Documentation
1. [Discovery API](./docs/discovery/discovery.md)
2. [Printer API](./docs/printer/Printer.md)
3. [EasySelect API](./docs/easyselect/EasySelect.md)
4. [Examples](./docs/QUICK_START.md)
5. [Supported devices](./docs/SUPPORTED_DEVICES.md)
6. [SDK information (v2.36.0)](./docs/SDK.md)
7. [Production verification matrix](./docs/PRODUCTION_VERIFICATION_MATRIX.md)

## Sponsor this project
If you like what I'm doing and want to support me, you can:

<p align="left">
  <a href="https://buymeacoffee.com/tr3v3r" target="_blank">
    <img width="500"  src="./docs/assets/coffee.png" alt="Buy me a coffee" />
  </a>
</p>

## Known issues

1. It's not possible to print and discover on Android simulator.

2. If you have an issue with using Flipper on iOS real device, [try this](./docs/flipperWorkaround.md) workaround.

## License

MIT
