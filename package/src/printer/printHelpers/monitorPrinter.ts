import type { Printer } from '../Printer';
import type { PrinterStatusResponse } from '../types';

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeInterval(interval: number): number {
  if (!Number.isFinite(interval)) {
    return 5000;
  }

  return Math.max(0, Math.floor(interval));
}

export function monitorPrinter(
  printer: Printer,
  listener: (status: PrinterStatusResponse) => void,
  interval: number = 5000
): () => void {
  let isMonitoring = true;
  const intervalMs = normalizeInterval(interval);

  async function performMonitor(): Promise<void> {
    while (isMonitoring) {
      try {
        try {
          await printer.connect();
        } catch {
          // Best effort connect before status polling.
        }

        try {
          const status = await printer.getStatus();
          try {
            listener(status);
          } catch {
            // Listener failures should not stop monitoring.
          }
        } finally {
          try {
            await printer.disconnect();
          } catch {
            // Best effort disconnect.
          }
        }
      } catch {
        // Keep monitor loop running on transient errors.
      }

      if (!isMonitoring) {
        break;
      }

      await wait(intervalMs);
    }
  }

  void performMonitor();

  return () => {
    isMonitoring = false;
  };
}
