# Performance Guidelines

## Choose the right transport

- LAN/TCP is generally the most predictable for large print jobs.
- Bluetooth is sensitive to payload size and environment noise.
- USB is stable but depends on host/device permissions and cable state.

## Keep payloads efficient

- Avoid very large raster images when text/symbol commands are enough.
- Resize/compress images before `addImage`.
- Prefer command-native primitives (`addText`, `addBarcode`, `addSymbol`) over large bitmap rendering when possible.

## Minimize round trips

- Queue complete command sets before `sendData`.
- Avoid repeated reconnects for back-to-back jobs unless required by workflow.

## Retry policy

- Use bounded retries for transient readiness/connectivity errors.
- Avoid unbounded retry loops that can lock printer transport.

## Observe runtime metrics

Track at least:

- connect latency
- sendData duration
- failure rate by method
- failure rate by transport

These metrics help detect regressions after SDK or RN upgrades.
