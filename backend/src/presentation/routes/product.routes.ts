import express, { Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { ProductSearchService } from "../../application/catalog/ProductSearchService";
import { prisma } from "../../infrastructure/database/prismaClient";

const router = express.Router();

/**
 * Repository Adapter (Prisma → Domain)
 */
const productRepo = {
  findById: (id: string) =>
    prisma.product.findUnique({ where: { id } }),

  findBySku: (sku: string) =>
    prisma.product.findUnique({ where: { sku } }),

  findByBarcode: (barcode: string) =>
    prisma.product.findFirst({ where: { barcode } }),

  search: (query: string) =>
    prisma.product.findMany({
      where: {
        name: { contains: query },
      },
      take: 20,
    }),
};

/**
 * Service instance
 */
const productSearchService = new ProductSearchService(productRepo);

/**
 * SEARCH PRODUCTS
 */
router.get(
  "/search",
  authMiddleware,
  async (req: Request, res: Response) => {
    const q = String(req.query.q || "");

    const result = await productSearchService.search(q);

    return res.json({
      message: "Products found",
      data: result,
    });
  }
);

/**
 * BARCODE SEARCH
 */
router.get(
  "/barcode/:code",
  authMiddleware,
  async (req: Request, res: Response) => {
    const code = String(req.params.code);

    const product = await productSearchService.find({
      barcode: code,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Product found",
      data: product,
    });
  }
);

export default router;