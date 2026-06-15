import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { ReceiptGenerator } from "../../application/sales/ReceiptGenerator";
import { prisma } from "../../infrastructure/database/prismaClient";

const router = express.Router();

const receiptGenerator = new ReceiptGenerator();

/**
 * GET /receipt/:saleId
 */
router.get(
  "/:saleId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const saleId = String(req.params.saleId);

      const sale = await prisma.sale.findUnique({
        where: { id: saleId },
      });

      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      const payment = await prisma.payment.findFirst({
        where: { saleId },
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      const receipt = receiptGenerator.generate({
        sale: {
          id: sale.id,
          branchId: sale.branchId,
          customerId: sale.customerId ?? undefined,
          total: sale.totalAmount,
          status: sale.status,
          items: [], // safe fallback (replace later if needed)
        } as any,
        payment: {
          id: payment.id,
          saleId: payment.saleId,
          type: payment.type,
          amount: payment.amount,
          paidAt: payment.paidAt,
        } as any,
        branchName: "NexaPOS",
      });

      return res.json({
        message: "Receipt generated successfully",
        data: receipt,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;