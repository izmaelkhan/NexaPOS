import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { PromotionEngine } from "../../application/pricing/PromotionEngine";
import { Discount, DiscountType } from "../../domain/pricing/Discount";
import { Coupon } from "../../domain/pricing/Coupon";

const router = express.Router();

/**
 * MOCK ENGINE (replace with DI in real app)
 */
const engine = new PromotionEngine();

/**
 * =========================
 * POST /coupon/apply
 * =========================
 */
router.post("/coupon/apply", authMiddleware, async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || amount <= 0) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    // normally fetched from DB
    const coupon = new Coupon({
      code,
      expiry: new Date(Date.now() + 100000),
      usageLimit: 5,
      appliedDiscount: 100,
    });

    const discount = coupon.apply();

    const finalAmount = Math.max(0, amount - discount);

    return res.json({
      message: "Coupon applied",
      data: {
        originalAmount: amount,
        discount,
        finalAmount,
      },
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * =========================
 * POST /discount/create
 * =========================
 */
router.post("/discount/create", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      type,
      value,
      startDate,
      endDate,
      branchId,
    } = req.body;

    const discount = new Discount({
      id: crypto.randomUUID(),
      name,
      type: type as DiscountType,
      value,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      branchId,
    });

    // normally save to DB here

    return res.json({
      message: "Discount created",
      data: discount,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

/**
 * =========================
 * GET /promotions/active
 * =========================
 */
router.get("/promotions/active", authMiddleware, async (req, res) => {
  try {
    const branchId = req.query.branchId as string;

    const activePromotions = await engine.getActivePromotions({
      branchId,
    });

    return res.json({
      message: "Active promotions fetched",
      data: activePromotions,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default router;