import { Supplier } from "../../domain/suppliers/Supplier";
import { SupplierLedger, SupplierLedgerType} from "../../domain/suppliers/SupplierLedger";

type PaySupplierInput = {
  supplier: Supplier;
  amount: number;
};

export class PaySupplierUseCase {
  constructor(private readonly supplierLedgerRepo: any) {}

  async execute(input: PaySupplierInput) {
    const { supplier, amount } = input;

    // =====================
    // 1. VALIDATION
    // =====================
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }

    if (amount > supplier.balance) {
      throw new Error("Payment exceeds supplier payable balance");
    }

    // =====================
    // 2. CREATE LEDGER ENTRY (PAYMENT)
    // =====================
    const ledgerEntry = new SupplierLedger({
      id: crypto.randomUUID(),
      supplierId: supplier.id,
      type: SupplierLedgerType.PAYMENT,
      amount,
    });

    await this.supplierLedgerRepo.save(ledgerEntry);

    // =====================
    // 3. UPDATE SUPPLIER BALANCE
    // =====================
    supplier.pay(amount);

    // =====================
    // 4. RETURN RESULT
    // =====================
    return {
      supplierId: supplier.id,
      paidAmount: amount,
      remainingBalance: supplier.balance,
      isFullySettled: supplier.balance === 0,
    };
  }
}