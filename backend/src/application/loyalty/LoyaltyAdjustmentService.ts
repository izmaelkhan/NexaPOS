export class LoyaltyAdjustmentService {

  constructor(
    private readonly loyaltyRepo: {
      getPoints(customerId: string): Promise<number>;

      deductPoints(
        customerId: string,
        points: number
      ): Promise<void>;
    }
  ) {}



  async deductForReturn(input: {
    customerId: string;
    returnedAmount: number;
  }) {


    if (!input.customerId) {
      throw new Error(
        "Customer required for loyalty adjustment"
      );
    }


    if (input.returnedAmount <= 0) {
      throw new Error(
        "Invalid return amount"
      );
    }



    // Example:
    // 1 point = 10 currency

    const pointsToRemove =
      Math.floor(
        input.returnedAmount / 10
      );



    if (pointsToRemove <= 0) {
      return {
        deducted: 0,
      };
    }



    const currentPoints =
      await this.loyaltyRepo.getPoints(
        input.customerId
      );



    const deduction =
      Math.min(
        currentPoints,
        pointsToRemove
      );



    await this.loyaltyRepo.deductPoints(
      input.customerId,
      deduction
    );



    return {
      deducted: deduction,
    };

  }

}