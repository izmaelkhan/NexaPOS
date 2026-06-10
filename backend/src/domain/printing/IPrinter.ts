import { ReceiptDto } from "../../application/printing/ReceiptDto";

export type PrinterType = "USB" | "NETWORK" | "BLUETOOTH";

export interface IPrinter {
  print(receipt: string): Promise<void>;

  isConnected(): Promise<boolean>;

  getType(): PrinterType;

  getPaperStatus?(): Promise<
    "OK" | "OUT_OF_PAPER"
  >;
}