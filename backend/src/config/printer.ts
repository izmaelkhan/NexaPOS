export type PrinterType =
  | "USB"
  | "NETWORK"
  | "BLUETOOTH";

const printerType =
  process.env.PRINTER_TYPE ?? "USB";

const allowedTypes = [
  "USB",
  "NETWORK",
  "BLUETOOTH",
];

if (!allowedTypes.includes(printerType)) {
  throw new Error(
    `Invalid PRINTER_TYPE: ${printerType}`
  );
}

export const printerConfig = {
  type: printerType as PrinterType,
  name:
    process.env.PRINTER_NAME ??
    "POS-80MM",
};