import { PaymentMethod } from "../../domain/payments/Payments";

type Sale = {
  id: string;
  total: number;
};

type Payment = {
  saleId: string;
  amount: number;
  method: PaymentMethod;
};

type MismatchType =
  | "OVERPAID"
  | "UNDERPAID"
  | "NO_PAYMENT";

type ReconciliationResult = {
  saleId: string;
  expected: number;
  paid: number;
  status: "OK" | "MISMATCH";
  issue?: MismatchType;
};

export class ReconciliationService {
  constructor(
    private readonly saleRepo: {
      findById(id: string): Promise<Sale | null>;
    },
    private readonly paymentRepo: {
      findBySaleId(
        saleId: string
      ): Promise<Payment[]>;
    },
    private readonly alertRepo?: {
      create(alert: any): Promise<void>;
    }
  ) {}

  // =========================
  // MAIN RECONCILIATION
  // =========================
  async reconcileSale(
    saleId: string
  ): Promise<ReconciliationResult> {
    const sale =
      await this.saleRepo.findById(saleId);

    if (!sale) {
      throw new Error("Sale not found");
    }

    const payments =
      await this.paymentRepo.findBySaleId(
        saleId
      );

    const totalPaid = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    let result: ReconciliationResult = {
      saleId,
      expected: sale.total,
      paid: totalPaid,
      status: "OK",
    };

    // =========================
    // NO PAYMENT
    // =========================
    if (payments.length === 0) {
      result.status = "MISMATCH";
      result.issue = "NO_PAYMENT";

      await this.generateAlert(result);

      return result;
    }

    // =========================
    // UNDERPAID
    // =========================
    if (totalPaid < sale.total) {
      result.status = "MISMATCH";
      result.issue = "UNDERPAID";

      await this.generateAlert(result);

      return result;
    }

    // =========================
    // OVERPAID
    // =========================
    if (totalPaid > sale.total) {
      result.status = "MISMATCH";
      result.issue = "OVERPAID";

      await this.generateAlert(result);

      return result;
    }

    return result;
  }

  // =========================
  // ALERT GENERATOR
  // =========================
  private async generateAlert(
    result: ReconciliationResult
  ) {
    if (!this.alertRepo) return;

    await this.alertRepo.create({
      type: "PAYMENT_MISMATCH",
      saleId: result.saleId,
      expected: result.expected,
      paid: result.paid,
      issue: result.issue,
      createdAt: new Date(),
    });
  }

  // =========================
  // BULK RECONCILIATION
  // =========================
  async reconcileAll(
    saleIds: string[]
  ): Promise<ReconciliationResult[]> {
    const results: ReconciliationResult[] = [];

    for (const id of saleIds) {
      const res =
        await this.reconcileSale(id);
      results.push(res);
    }

    return results;
  }
}