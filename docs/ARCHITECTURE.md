# Architecture

## Goals

This fork prioritizes production-safe Epson printer flows on React Native with a clear SDK baseline:

- Epson ePOS SDK Android v2.36.0
- Epson ePOS SDK iOS v2.36.0

## Layering

1. Public API (`package/src/index.tsx`)
   - Exports discovery, printer, and EasySelect APIs.
2. Typed wrappers (`package/src/printer`, `package/src/discovery`, `package/src/easyselect`)
   - Normalizes errors and maps native payloads into stable TS types.
3. Native specs (`package/src/specs/*.ts`)
   - Defines TurboModule contracts and constants.
4. Native implementation (`package/android`, `package/ios`)
   - Android Java/Kotlin bridge + JNI libs.
   - iOS Objective-C++ bridge + vendored xcframeworks.

## Android design

- New Architecture is required and enforced by package Gradle logic.
- Epson jars are linked from `package/android/libs`.
- Epson native libs are vendored across `armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`.

## iOS design

- iOS minimum deployment target is 15.0.
- Uses Epson dynamic `libepos2.xcframework` and `libeposeasyselect.xcframework`.
- Imports follow dynamic framework style (`<libepos2/ePOS2.h>`).

## EasySelect design

- `createQR` and `parseQR` are available on Android and iOS.
- `parseNFC` is available on Android and iOS.
- `parseBeacon` is currently iOS-only.

## Runtime behavior conventions

- `target` is SDK-owned data. Consumers should not normalize or construct targets manually.
- Printer wrappers favor deterministic cleanup (`disconnect` in `finally`).
- Error mapping is explicit by method for actionable diagnostics.

## Non-goals

- This package does not attempt full Epson peripheral feature parity beyond printer-focused workflows.
- Simulator behavior is not treated as hardware parity evidence.
