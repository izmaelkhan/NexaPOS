export type ReturnPolicyInput = {
  invoiceId?: string;

  saleDate: Date;

  items: Array<{
    productId: string;
    quantity: number;
    damaged?: boolean;
    returnable?: boolean;
  }>;
};


export class ReturnPolicyService {

  private readonly RETURN_WINDOW_DAYS = 7;


  validate(
    input: ReturnPolicyInput
  ): boolean {


    // =====================
    // INVOICE REQUIRED
    // =====================

    if (!input.invoiceId) {
      throw new Error(
        "Invoice required for return"
      );
    }



    // =====================
    // RETURN WINDOW CHECK
    // =====================

    const today = new Date();


    const diffTime =
      today.getTime() -
      input.saleDate.getTime();


    const diffDays =
      Math.floor(
        diffTime /
        (1000 * 60 * 60 * 24)
      );



    if (
      diffDays >
      this.RETURN_WINDOW_DAYS
    ) {
      throw new Error(
        "Return period expired"
      );
    }



    // =====================
    // ITEM VALIDATION
    // =====================

    for (
      const item of input.items
    ) {


      if (
        item.quantity <= 0
      ) {
        throw new Error(
          "Invalid return quantity"
        );
      }



      // Damaged items restriction

      if (
        item.damaged === true
      ) {
        throw new Error(
          `Damaged item cannot be returned: ${item.productId}`
        );
      }



      // Non returnable product

      if (
        item.returnable === false
      ) {
        throw new Error(
          `Product is not returnable: ${item.productId}`
        );
      }

    }


    return true;
  }


  canReturn(
    input: ReturnPolicyInput
  ): boolean {

    try {

      this.validate(input);

      return true;

    } catch {

      return false;

    }

  }

}