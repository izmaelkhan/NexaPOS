import { prisma } from "../../infrastructure/database/prismaClient";

export class ProductSearchService {
  /**
   * FAST POS SEARCH (<50ms target)
   * priority:
   * 1. barcode exact
   * 2. sku exact
   * 3. name partial
   */

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const q = query.trim();

    // =====================
    // 1. EXACT MATCH (FASTEST)
    // =====================
    const exactMatch = await prisma.product.findFirst({
      where: {
        OR: [
          { sku: q },
          { barcode: q },
        ],
      },
    });

    if (exactMatch) {
      return [exactMatch];
    }

    // =====================
    // 2. PREFIX SEARCH (FAST INDEXED)
    // =====================
    const prefixMatch = await prisma.product.findMany({
      where: {
        OR: [
          { sku: { startsWith: q } },
          { barcode: { startsWith: q } },
        ],
      },
      take: 10,
    });

    if (prefixMatch.length > 0) {
      return prefixMatch;
    }

    // =====================
    // 3. NAME SEARCH (FALLBACK)
    // =====================
    const nameMatch = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      take: 20,
    });

    return nameMatch;
  }
}