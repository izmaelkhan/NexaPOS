import { PrinterType } from "./PrinterType";

export type PrinterDevice = {
  id: string;
  name: string;
  type: PrinterType;

  isActive: boolean;
  priority: number; // for fallback routing

  meta?: {
    ipAddress?: string; // NETWORK
    port?: number;
    usbPath?: string; // USB
    bluetoothMac?: string; // BLUETOOTH
  };
};