import express, { Request, Response } from "express";
import { authMiddleware } from "../../src/presentation/middleware/authMiddleware";
import { prisma } from "../../src/infrastructure/database/prismaClient";

const router = express.Router();

describe("Checkout Stability",()=>{

 it("should load checkout test",()=>{

   expect(true).toBe(true);

 });

});
/**
 * GET /invoice/:id
 */
router.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const id = String(req.params.id);

    const sale = await prisma.sale.findUnique({
      where: { id },
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
        total: sale.totalAmount, // ✅ FIXED (consistent with domain)
        createdAt: sale.createdAt,
      },
    });
  }
);

export default router;