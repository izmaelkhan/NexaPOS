import { IPrinter, PrinterType } from "../../domain/printing/IPrinter";
import { ReceiptDto } from "../../application/printing/ReceiptDto";

export class ThermalPrinterService implements IPrinter {
  async print(receipt: string): Promise<void> {
    console.log(receipt);
  }

  async isConnected(): Promise<boolean> {
    return true;
  }

  getType(): PrinterType {
    return "USB";
  }

  async getPaperStatus(): Promise<"OK" | "OUT_OF_PAPER"> {
    return "OK";
  }
}