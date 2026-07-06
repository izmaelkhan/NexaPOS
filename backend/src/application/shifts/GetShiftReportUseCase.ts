import { CashMovement, CashMovementType } from "../../domain/shifts/CashMovement";

export class GetShiftReportUseCase {
  constructor(
    private readonly shiftRepo: {
      findById(id: string): Promise<any>;
    },

    private readonly movementRepo: {
      findByShiftId(shiftId: string): Promise<CashMovement[]>;
    }
  ) {}

  async execute(shiftId: string) {
    // =====================
    // LOAD SHIFT
    // =====================
    const shift = await this.shiftRepo.findById(shiftId);

    if (!shift) {
      throw new Error("Shift not found");
    }

    // =====================
    // LOAD MOVEMENTS
    // =====================
    const movements = await this.movementRepo.findByShiftId(shiftId);

    // =====================
    // INITIAL VALUES
    // =====================
    let cashSales = 0;
    let refunds = 0;
    let expenses = 0;

    // =====================
    // AGGREGATION
    // =====================
    for (const m of movements) {
      switch (m.type) {
        case CashMovementType.SALE_CASH:
          cashSales += m.amount;
          break;

        case CashMovementType.REFUND_CASH:
          refunds += m.amount;
          break;

        case CashMovementType.EXPENSE:
        case CashMovementType.CASH_OUT:
          expenses += m.amount;
          break;
      }
    }

    // =====================
    // EXPECTED CASH
    // =====================
    const expectedCash =
      shift.openingCash +
      cashSales -
      refunds -
      expenses;

    // =====================
    // FINAL REPORT
    // =====================
    return {
      openingCash: shift.openingCash,
      cashSales,
      refunds,
      expenses,
      expectedCash,
    };
  }
}