import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { prisma } from "../../infrastructure/database/prismaClient";

const router = express.Router();

// =====================
// GET INVOICE
// =====================

router.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);

      const sale = await prisma.sale.findUnique({
        where: {
          id,
        },
      });

      if (!sale) {
        return res.status(404).json({
          message: "Invoice not found",
        });
      }

      return res.json({
        message: "Invoice fetched successfully",
        data: {
          invoiceId: sale.id,
          branchId: sale.branchId,
          customerId: sale.customerId,
          total: sale.totalAmount,
          createdAt: sale.createdAt,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;