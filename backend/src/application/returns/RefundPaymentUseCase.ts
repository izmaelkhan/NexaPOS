import { PaymentMethod } from "../../domain/payments/Payments";
import { AuditLogger } from "../../shared/audit/AuditLogger";


type RefundInput = {
  returnId: string;
  amount: number;

  method:
    | PaymentMethod.CASH
    | PaymentMethod.CARD
    | PaymentMethod.STORE_CREDIT;
};



export class RefundPaymentUseCase {

  constructor(

    private readonly returnRepo: {
      findById(id: string): Promise<any>;
    },


    private readonly paymentRepo: {
      create(data: any): Promise<void>;
    },


    private readonly customerRepo?: {
      addBalance(
        customerId: string,
        amount: number
      ): Promise<void>;
    }

  ) {}



  async execute(
    input: RefundInput
  ) {
    // =====================
    // LOAD RETURN
    // =====================

    const returnRequest =
      await this.returnRepo.findById(
        input.returnId
      );

    if (!returnRequest) {
      throw new Error(
        "Return not found"
      );
    }
    if (
      input.amount <= 0
    ) {
      throw new Error(
        "Refund amount must be greater than 0"
      );
    }

    // =====================
    // STORE CREDIT
    // =====================

    if (
      input.method ===
      PaymentMethod.STORE_CREDIT
    ) {


      if (
        !this.customerRepo ||
        !returnRequest.customerId
      ) {
        throw new Error(
          "Customer required for store credit"
        );
      }


      await this.customerRepo.addBalance(
        returnRequest.customerId,
        input.amount
      );

    }



    // =====================
    // CREATE REFUND PAYMENT
    // =====================

    const refundPayment = {

      paymentId:
        crypto.randomUUID(),

      saleId:
        returnRequest.saleId,


      returnId:
        input.returnId,


      amount:
        -Math.abs(input.amount),


      method:
        input.method,


      state:
        "REFUNDED",


      createdAt:
        new Date(),

    };



    await this.paymentRepo.create(
      refundPayment
    );



    // =====================
    // AUDIT
    // =====================

    AuditLogger.log({

      type:
        "REFUND_ISSUED",

      timestamp:
        new Date(),

      data: {

        returnId:
          input.returnId,

        method:
          input.method,

        amount:
          input.amount,

      }

    });



    return {

      success: true,

      refundPayment,

    };

  }

}