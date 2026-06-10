import { PrintQueue } from "../../src/application/printing/PrintQueue";
import { ReceiptFormatter } from "../../src/application/printing/ReceiptFormatter";
import { ReprintReceiptUseCase } from "../../src/application/printing/ReprintReceiptUseCase";
import { ReceiptFormat } from "../../src/application/printing/ReceiptFormatter";

describe("Printing System (TDD)", () => {
  // =====================
  // MOCK PRINTER
  // =====================
  const printer = {
    isConnected: jest.fn(),
    print: jest.fn(),
    getPaperStatus: jest.fn(),
    getType: jest.fn().mockReturnValue("THERMAL_58MM"),
  };

  const invoiceRepo = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================
  // 1. RECEIPT FORMATTING
  // =====================
  test("receipt formatting correct", () => {
    const receipt = {
      invoiceNumber: "INV-1",
      branchName: "Main",
      cashierName: "Ali",
      items: [
        {
          productId: "P1",
          productName: "Milk",
          quantity: 2,
          unitPrice: 100,
          lineTotal: 200,
        },
      ],
      subtotal: 200,
      discount: 0,
      tax: 0,
      total: 200,
      paymentMethod: "CASH",
    };

    const output = ReceiptFormatter.format(
      receipt,
      ReceiptFormat.MM58
    );

    expect(output).toContain("Milk");
    expect(output).toContain("INV-1");
    expect(output).toContain("200");
  });

  // =====================
  // 2. QUEUE PROCESSING
  // =====================
  test("queue processes jobs FIFO", async () => {
    printer.isConnected.mockResolvedValue(true);
    printer.print.mockResolvedValue(undefined);

    const queue = new PrintQueue(printer);

    queue.enqueue({
      id: "1",
      invoiceId: "INV-1",
      receipt: {
        invoiceNumber: "INV-1",
        branchName: "B1",
        cashierName: "C1",
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        paymentMethod: "CASH",
      },
      format: ReceiptFormat.MM58,
    });

    queue.enqueue({
      id: "2",
      invoiceId: "INV-2",
      receipt: {
        invoiceNumber: "INV-2",
        branchName: "B1",
        cashierName: "C1",
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        paymentMethod: "CASH",
      },
      format: ReceiptFormat.MM58,
    });

    await queue.process();

    expect(printer.print).toHaveBeenCalledTimes(2);
  });

  // =====================
  // 3. PRINTER OFFLINE HANDLING
  // =====================
  test("printer unavailable handled", async () => {
    printer.isConnected.mockResolvedValue(false);

    const queue = new PrintQueue(printer);

    queue.enqueue({
      id: "1",
      invoiceId: "INV-1",
      receipt: {
        invoiceNumber: "INV-1",
        branchName: "B1",
        cashierName: "C1",
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        paymentMethod: "CASH",
      },
      format: ReceiptFormat.MM58,
    });

    await queue.process();

    expect(printer.print).not.toHaveBeenCalled();
  });

  // =====================
  // 4. REPRINT FLOW
  // =====================
  test("reprint works correctly", async () => {
    printer.isConnected.mockResolvedValue(true);
    printer.print.mockResolvedValue(undefined);

    invoiceRepo.findById.mockResolvedValue({
      invoiceNumber: "INV-100",
      branchName: "Main",
      cashierName: "Ali",
      items: [],
      pricing: {
        subtotal: 0,
        discount: 0,
        tax: 0,
        grandTotal: 0,
      },
      paymentMethod: "CASH",
    });

    const useCase = new ReprintReceiptUseCase(
      invoiceRepo,
      printer
    );

    await useCase.execute({
      invoiceId: "INV-100",
      format: ReceiptFormat.MM58,
    });

    expect(printer.print).toHaveBeenCalled();
    expect(invoiceRepo.findById).toHaveBeenCalledWith(
      "INV-100"
    );
  });
});