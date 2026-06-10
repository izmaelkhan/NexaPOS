import express from "express";
import { PrintReceiptUseCase } from "../../application/printing/PrintReceiptUseCase";
import { ReprintReceiptUseCase } from "../../application/printing/ReprintReceiptUseCase";
import { PrinterHealthService } from "../../application/printing/PrinterHealthService";
import { ThermalPrinterService } from "../../infrastructure/printing/ThermalPrinterService";

const router = express.Router();

// =====================
// DEPENDENCIES (TEMP SIMPLE WIRING)
// =====================
const printer = new ThermalPrinterService();

const printerHealth = new PrinterHealthService(printer);

// Mock invoice repo (replace with DB)
const invoiceRepo = {
  findById: async (id: string) => {
    return {
      invoiceNumber: id,
      branchName: "Main Branch",
      cashierName: "System",
      items: [],
      pricing: {
        subtotal: 0,
        discount: 0,
        tax: 0,
        grandTotal: 0,
      },
      paymentMethod: "CASH",
    };
  },
};

// UseCases
const printReceiptUseCase = new PrintReceiptUseCase(
  invoiceRepo,
  printer
);

const reprintReceiptUseCase = new ReprintReceiptUseCase(
  invoiceRepo,
  printer
);

// =====================
// 1. PRINT RECEIPT
// =====================
router.post("/print/receipt", async (req, res) => {
  try {
    const { invoiceId, format } = req.body;

    await printReceiptUseCase.execute({
      invoiceId,
      format,
    });

    return res.json({
      success: true,
      message: "Receipt printed successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// 2. REPRINT RECEIPT
// =====================
router.post("/print/reprint", async (req, res) => {
  try {
    const { invoiceId, format } = req.body;

    await reprintReceiptUseCase.execute({
      invoiceId,
      format,
    });

    return res.json({
      success: true,
      message: "Receipt reprinted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================
// 3. PRINTER STATUS
// =====================
router.get("/printer/status", async (req, res) => {
  try {
    const status = await printerHealth.checkHealth();

    return res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;