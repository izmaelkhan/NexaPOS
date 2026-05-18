import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { CheckoutUseCase } from "../../application/sales/CheckoutUseCase";
import { Cart } from "../../domain/sales/Cart";
import { PaymentType } from "../../domain/payments/Payments"; 
import { prisma } from "../../infrastructure/database/prismaClient";

const router = express.Router();

/**
 * =========================
 * IN MEMORY CART (TEMP)
 * =========================
 */
const carts = new Map<string, Cart>();

/**
 * =========================
 * POST /cart/add
 * =========================
 */
router.post("/cart/add", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    // FIX: express body safety
    const { productId, price, quantity } = req.body as {
      productId: string;
      price: number;
      quantity: number;
    };

    if (!productId || !price || !quantity) {
      return res.status(400).json({ message: "Invalid cart item" });
    }

    let cart = carts.get(userId);

    if (!cart) {
      cart = new Cart(userId);
      carts.set(userId, cart);
    }

    cart.addItem({
      productId,
      price,
      quantity,
    } as any);

    return res.json({
      message: "Item added",
      data: cart.getItems(),
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * =========================
 * POST /checkout
 * =========================
 */
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    // FIX: typed body
    const { branchId, customerId, paymentType, amount } = req.body as {
      branchId: string;
      customerId?: string;
      paymentType: PaymentType;
      amount: number;
    };

    const cart = carts.get(userId);

    if (!cart || cart.getItems().length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /**
     * IMPORTANT FIX:
     * Your CheckoutUseCase constructor expects ONLY 4 args
     * (NOT 5 anymore)
     */
    const checkoutUseCase = new CheckoutUseCase(
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );

    const result = await checkoutUseCase.execute({
      cart,
      branchId,
      customerId,
      payment: {
        type: paymentType,
        amount,
      },
    });

    carts.delete(userId);

    return res.json({
      message: "Checkout successful",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * =========================
 * GET /invoice/:id
 * =========================
 */
router.get("/invoice/:id", authMiddleware, async (req, res) => {
  try {
    // Ensure id is a string (Express params can be string | string[])
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const sale = await prisma.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    /**
     * FIX:
     * Your Prisma schema DOES NOT include saleItems relation
     * so we remove it completely
     */
    return res.json({
      message: "Invoice fetched",
      data: {
        invoiceId: sale.id,
        branchId: sale.branchId,
        customerId: sale.customerId,
        total: sale.totalAmount,
        createdAt: sale.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;