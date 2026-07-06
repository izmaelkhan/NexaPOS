import { CashMovement, CashMovementType } from "../../domain/shifts/CashMovement";

export class CashDrawerService {
  constructor(
    private readonly movementRepo: {
      findByShiftId(shiftId: string): Promise<CashMovement[]>;
      create(movement: CashMovement): Promise<void>;
    },

    private readonly shiftRepo: {
      findById(id: string): Promise<any>;
    }
  ) {}

  // =========================
  // ADD CASH
  // =========================
  async addCash(input: {
    shiftId: string;
    amount: number;
    referenceId?: string;
    reason?: string;
  }) {
    if (input.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const movement = new CashMovement({
      id: crypto.randomUUID(),
      shiftId: input.shiftId,
      amount: input.amount,
      type: CashMovementType.CASH_IN,
      referenceId: input.referenceId,
      createdAt: new Date(),
    });

    await this.movementRepo.create(movement);

    return { success: true, movement };
  }

  // =========================
  // REMOVE CASH
  // =========================
  async removeCash(input: {
    shiftId: string;
    amount: number;
    referenceId?: string;
    reason?: string;
  }) {
    if (input.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const movement = new CashMovement({
      id: crypto.randomUUID(),
      shiftId: input.shiftId,
      amount: input.amount,
      type: CashMovementType.CASH_OUT,
      referenceId: input.referenceId,
      createdAt: new Date(),
    });

    await this.movementRepo.create(movement);

    return { success: true, movement };
  }

  // =========================
  // EXPECTED CASH
  // =========================
  async calculateExpectedCash(shiftId: string) {
    const shift = await this.shiftRepo.findById(shiftId);

    if (!shift) {
      throw new Error("Shift not found");
    }

    const movements = await this.movementRepo.findByShiftId(shiftId);

    let expectedCash = shift.openingCash || 0;

    for (const m of movements) {
      switch (m.type) {
        case CashMovementType.SALE_CASH:
        case CashMovementType.CASH_IN:
          expectedCash += m.amount;
          break;

        case CashMovementType.REFUND_CASH:
        case CashMovementType.EXPENSE:
        case CashMovementType.CASH_OUT:
          expectedCash -= m.amount;
          break;
      }
    }

    return {
      shiftId,
      openingCash: shift.openingCash,
      expectedCash,
    };
  }
}