import express from "express";
import { CheckoutUseCase } from "../../application/sales/CheckoutUseCase";
import { PaymentType } from "../../domain/payments/Payments";
import { Cart } from "../../domain/sales/Cart";

const router = express.Router();

/**
 * TEMP CART STORE (replace with Redis later)
 */
const carts = new Map<string, Cart>();

// =====================
// POST /checkout/validate
// =====================
router.post("/validate", async (req, res) => {
  const { customerId, branchId, amount, paymentType } = req.body;

  const cart = carts.get(customerId);

  if (!cart) {
    return res.status(400).json({
      message: "Cart not found",
    });
  }

  try {
    const useCase = new CheckoutUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );

    const result = await useCase.execute({
      cart,
      branchId,
      customerId,
      payment: {
        type: paymentType as PaymentType,
        amount,
      },
    });

    return res.json({
      message: "Validation successful",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

export default router;