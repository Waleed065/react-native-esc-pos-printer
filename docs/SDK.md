# EPSON ESC POS Android IOS SDK

Android: <strong>2.27.0</strong>
iOS: <strong>2.27.0</strong>

Because of GitHub Large Files limitation the SDK for Android and iOS moved to [separate npm package](https://www.npmjs.com/package/react-native-esc-pos-printer-sdk)

### Android ABI support

The bundled Android Epson SDK artifacts include native libraries for:

- `armeabi-v7a`
- `arm64-v8a`
- `x86`
- `x86_64`

In this repository, these binaries are available under:

- `package/android/src/main/jniLibs/<abi>/libepos2.so`
- `package/node_modules/react-native-esc-pos-printer-sdk/android/jniLibs/<abi>/libepos2.so`

### Contribution guide

If you wan't to understand how SDK works or you need some additional functionality, you can read manuals for [iOS](./iOS_v2.27.0.pdf) and [Android](./android_v2.27.0.pdf), create PR with extracted method or, if don't have enough experience, you can create feature request in issues section of this repo.

