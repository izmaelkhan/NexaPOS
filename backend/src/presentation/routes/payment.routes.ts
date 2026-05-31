import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { ProcessPaymentUseCase } from "../../application/payments/ProcessPaymentUseCase";
import { SplitPaymentUseCase } from "../../application/payments/SplitPaymentUseCase";
import { RefundIntegrationService } from "../../application/payments/RefundIntegrationService";
import { PaymentQueryService } from "../../application/payments/PaymentQueryService";

const router = express.Router();

/**
 * =========================
 * POST /payment/process
 * =========================
 */
router.post("/process", authMiddleware, async (req, res) => {
  try {
    const useCase = new ProcessPaymentUseCase(
      {} as any, // paymentRepo
      {} as any  // validator
    );

    const result = await useCase.execute(req.body);

    return res.json({
      message: "Payment processed",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * =========================
 * POST /payment/split
 * =========================
 */
router.post("/split", authMiddleware, async (req, res) => {
  try {
    const useCase = new SplitPaymentUseCase(
      {} as any,
      {} as any
    );

    const result = await useCase.execute(req.body);

    return res.json({
      message: "Split payment processed",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

/**
 * =========================
 * GET /payment/:saleId
 * =========================
 */
router.get("/:saleId", authMiddleware, async (req, res) => {
  try {
    const service = new PaymentQueryService({} as any);

    const saleId = String(req.params.saleId);
    const result = await service.getBySaleId(saleId);

    return res.json({
      message: "Payments fetched",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * =========================
 * POST /payment/refund
 * =========================
 */
router.post("/refund", authMiddleware, async (req, res) => {
  try {
    const service = new RefundIntegrationService(
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );

    const result = await service.processRefund(req.body);

    return res.json({
      message: "Refund processed",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;