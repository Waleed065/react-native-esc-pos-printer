import type { Printer } from '../Printer';
import type { PrinterStatusResponse } from '../types';

type ConnectUntilOptions = {
  maxAttempts?: number;
  connectTimeoutMs?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function tryToConnectUntil(
  printer: Printer,
  predicate: (status: PrinterStatusResponse) => boolean,
  options: ConnectUntilOptions = {}
): Promise<void> {
  const {
    maxAttempts = 20,
    connectTimeoutMs = 1500,
    initialDelayMs = 300,
    backoffMultiplier = 1.4,
    maxDelayMs = 3000,
  } = options;

  const normalizedMaxAttempts = Math.max(1, Math.floor(maxAttempts));
  const normalizedInitialDelay = Math.max(0, initialDelayMs);
  const normalizedBackoff = Math.max(1, backoffMultiplier);
  const normalizedMaxDelay = Math.max(normalizedInitialDelay, maxDelayMs);

  let delayMs = normalizedInitialDelay;

  for (let attempt = 1; attempt <= normalizedMaxAttempts; attempt += 1) {
    try {
      await printer.connect(connectTimeoutMs);
    } catch {
      // Best effort connect: status check below determines retry/exit.
    }

    const status = await printer.getStatus();
    if (predicate(status)) {
      return;
    }

    if (attempt < normalizedMaxAttempts && delayMs > 0) {
      await wait(delayMs);
      delayMs = Math.min(
        normalizedMaxDelay,
        Math.ceil(delayMs * normalizedBackoff)
      );
    }
  }

  throw new Error(
    `Unable to satisfy printer connection predicate after ${normalizedMaxAttempts} attempts.`
  );
}
