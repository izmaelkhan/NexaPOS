import { Shift, ShiftStatus } from "../../domain/shifts/Shift";

export class ShiftUIMapper {

  // =====================================
  // CURRENT SHIFT DISPLAY
  // =====================================

  static currentShift(shift: Shift) {
    return {
      id: shift.id,
      userId: shift.userId,
      branchId: shift.branchId,

      status: shift.status,

      openingCash: shift.openingCash,

      expectedCash: shift.expectedCash,

      difference: shift.difference,

      openedAt: shift.openedAt,

      closedAt: shift.closedAt ?? null,

      canClose: shift.status === ShiftStatus.OPEN,
    };
  }

  // =====================================
  // OPEN SHIFT DIALOG
  // =====================================

  static openingCashDialog() {
    return {
      title: "Open Shift",

      fields: [
        {
          name: "openingCash",
          label: "Opening Cash",
          type: "number",
          required: true,
          min: 0,
        },
      ],

      submitLabel: "Open Shift",
    };
  }

  // =====================================
  // CLOSE SHIFT DIALOG
  // =====================================

  static closingCashDialog(expectedCash: number) {
    return {
      title: "Close Shift",

      expectedCash,

      fields: [
        {
          name: "actualCash",
          label: "Actual Cash",
          type: "number",
          required: true,
          min: 0,
        },
      ],

      submitLabel: "Close Shift",
    };
  }

  // =====================================
  // DIFFERENCE WARNING
  // =====================================

  static differenceWarning(difference: number) {

    if (difference === 0) {
      return {
        level: "SUCCESS",
        title: "Cash Balanced",
        message: "Cash matches expected amount.",
      };
    }

    if (difference < 0) {
      return {
        level: "ERROR",
        title: "Cash Shortage",
        message: `Shortage of ${Math.abs(difference)}`,
        amount: Math.abs(difference),
      };
    }

    return {
      level: "WARNING",
      title: "Extra Cash",
      message: `Extra cash of ${difference}`,
      amount: difference,
    };
  }
}