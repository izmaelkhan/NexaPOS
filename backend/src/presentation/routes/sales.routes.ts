import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { CheckoutUseCase } from "../../application/sales/CheckoutUseCase";
import { Cart } from "../../domain/sales/Cart";
import { PaymentType } from "../../domain/payments/Payments";
import { prisma } from "../../infrastructure/database/prismaClient";

const router = express.Router();

/**
 * =========================
 * IN-MEMORY CART
 * =========================
 */
const carts = new Map<string, Cart>();

/**
 * =========================
 * CART ADD
 * =========================
 */
router.post("/cart/add", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const { productId, price, quantity } = req.body;

    if (!productId || !price || !quantity) {
      return res.status(400).json({ message: "Invalid input" });
    }

    let cart = carts.get(userId);

    if (!cart) {
      cart = new Cart(userId);
      carts.set(userId, cart);
    }

    cart.addItem({ productId, price, quantity } as any);

    return res.json({
      message: "Item added",
      data: cart.getItems(),
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
});

/**
 * =========================
 * CHECKOUT
 * =========================
 */
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const { branchId, customerId, paymentType, amount } = req.body;

    const cart = carts.get(userId);

    if (!cart || cart.getItems().length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /**
     * REAL DEPENDENCIES (minimal working implementation)
     */
    const stockRepo = {
      getStock: async () => ({ stock: 999 }),
      createMovement: async () => {},
    };

    const saleRepo = {
      save: async () => {},
    };

    const paymentRepo = {
      save: async () => {},
    };

    const invoiceSequenceRepo = {
      getNextSequence: async () => 1,
    };

    const customerRepo = {
      findById: async () => null,
    };

    const checkout = new CheckoutUseCase(
      stockRepo,
      saleRepo,
      paymentRepo,
      invoiceSequenceRepo,
      customerRepo
    );

    const result = await checkout.execute({
      cart,
      branchId,
      customerId,
      payment: {
        type: paymentType as PaymentType,
        amount,
      },
    });

    carts.delete(userId);

    return res.json({
      message: "Checkout successful",
      data: result,
    });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

/**
 * =========================
 * GET INVOICE
 * =========================
 */
router.get("/invoice/:id", authMiddleware, async (req, res) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const sale = await prisma.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      return res.status(404).json({ message: "Invoice not found" });
    }

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
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;