import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { ProductSearchService } from "../../application/catalog/ProductSearchService";
import { prisma } from "../../infrastructure/database/prismaClient";

const router = express.Router();

const productSearchService = new ProductSearchService();

/**
 * =========================
 * SAFE QUERY HELPER
 * =========================
 */
function getQueryString(value: unknown): string {
  if (Array.isArray(value)) return value[0] || "";
  if (typeof value === "string") return value;
  return "";
}

/**
 * =========================
 * SEARCH PRODUCTS (POS FAST)
 * /products/search?q=
 * =========================
 */
router.get(
  "/search",
  authMiddleware,
  async (req: Request, res: Response) => {
    const q = Array.isArray(req.query.q)
      ? req.query.q[0]
      : req.query.q;

    const query: string = String(q || "");

    const result = await productSearchService.search(query);

    return res.json({
      message: "Products found",
      data: result,
    });
  }
);
/**
 * =========================
 * BARCODE / SKU SCAN
 * /products/barcode/:code
 * =========================
 */
router.get(
  "/barcode/:code",
  authMiddleware,
  async (req: Request, res: Response) => {
    const code: string = String(req.params.code || "");

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { barcode: code },
          { sku: code },
        ],
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({
      message: "Product found",
      data: product,
    });
  }
);
export default router;