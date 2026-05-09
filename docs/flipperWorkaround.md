# iOS Flipper note

This package does not require a Flipper workaround by default.

Older React Native projects may have OpenSSL/Flipper conflicts unrelated to this package's core APIs. If you hit a Flipper-only crash on iOS real devices:

1. First verify the app without Flipper.
2. Verify your React Native version and current Flipper pod versions.
3. Apply a project-specific workaround only if the issue reproduces with your exact RN stack.

Historical issue context:

- https://github.com/tr3v3r/react-native-esc-pos-printer/issues/44

For production printer validation, do not treat Flipper-only behavior as printer API parity failure.
