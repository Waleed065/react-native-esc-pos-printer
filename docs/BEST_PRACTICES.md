# Best Practices

## Connection lifecycle

Use a strict lifecycle:

1. Create printer instance from discovered `target` + `deviceName`.
2. Connect (or `Printer.tryToConnectUntil`).
3. Queue commands.
4. `sendData`.
5. Always disconnect in `finally`.

## Keep targets SDK-owned

Use the exact `target` produced by discovery or EasySelect parse results.
Do not rewrite prefixes or normalize values manually.

## Keep jobs compact

- Prefer one complete command buffer per receipt.
- Avoid unnecessary repeated status/settings calls inside hot print loops.
- Use `clearCommandBuffer` only for recovery scenarios.

## Error handling

- Surface method name + error message together.
- Implement single retry for transient communication readiness errors.
- Distinguish unsupported capability from transient transport failures.

## Platform-aware behavior

- Guard iOS-only and Android-only pathways in app code where needed.
- Do not assume BLE discovery or beacon parsing parity across both platforms.

## Testing discipline

- Validate each transport you ship in real hardware.
- Add smoke tests for connect/print/disconnect before advanced command coverage.
- Keep a matrix log for proven models and firmware.
