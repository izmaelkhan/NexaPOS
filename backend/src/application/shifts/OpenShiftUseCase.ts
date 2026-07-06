import { Shift, ShiftStatus } from "../../domain/shifts/Shift";

type OpenShiftInput = {
  userId: string;
  branchId: string;
  openingCash: number;
};

export class OpenShiftUseCase {
  constructor(
    private readonly shiftRepo: {
      findOpenByUserId(
        userId: string
      ): Promise<Shift | null>;

      save(shift: Shift): Promise<void>;
    }
  ) {}

  async execute(input: OpenShiftInput) {
    const { userId, branchId, openingCash } = input;

    // =========================
    // RULE 1: Opening cash required
    // =========================
    if (openingCash == null) {
      throw new Error(
        "Opening cash is required"
      );
    }

    if (openingCash < 0) {
      throw new Error(
        "Opening cash cannot be negative"
      );
    }

    // =========================
    // RULE 2: Only one active shift per user
    // =========================
    const activeShift =
      await this.shiftRepo.findOpenByUserId(userId);

    if (
      activeShift &&
      activeShift.status === ShiftStatus.OPEN
    ) {
      throw new Error(
        "User already has an open shift"
      );
    }

    // =========================
    // CREATE SHIFT
    // =========================
    const shift = new Shift({
      id: crypto.randomUUID(),
      userId,
      branchId,
      openingCash,
      status: ShiftStatus.OPEN,
      openedAt: new Date(),
    });

    await this.shiftRepo.save(shift);

    return {
      success: true,
      shiftId: shift.id,
      status: shift.status,
      openedAt: shift.openedAt,
    };
  }
}