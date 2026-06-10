import { IPrinter } from "../../domain/printing/IPrinter";

export type PrinterHealthStatus = {
  online: boolean;
  connected: boolean;
  paperStatus: "OK" | "OUT_OF_PAPER" | "UNKNOWN";
  checkedAt: Date;
};

export class PrinterHealthService {
  constructor(
    private readonly printer: IPrinter
  ) {}

  async checkHealth(): Promise<PrinterHealthStatus> {
    const connected =
      await this.printer.isConnected();

    let paperStatus:
      | "OK"
      | "OUT_OF_PAPER"
      | "UNKNOWN" = "UNKNOWN";

    // Optional capability
    if (
      "getPaperStatus" in this.printer &&
      typeof (this.printer as any)
        .getPaperStatus === "function"
    ) {
      try {
        paperStatus =
          await (this.printer as any)
            .getPaperStatus();
      } catch {
        paperStatus = "UNKNOWN";
      }
    }

    return {
      online: connected,
      connected,
      paperStatus,
      checkedAt: new Date(),
    };
  }

  async assertHealthy(): Promise<void> {
    const status =
      await this.checkHealth();

    if (!status.connected) {
      throw new Error(
        "Printer is offline"
      );
    }

    if (
      status.paperStatus ===
      "OUT_OF_PAPER"
    ) {
      throw new Error(
        "Printer is out of paper"
      );
    }
  }
}