type Product = {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
};

export class ProductSearchService {
  private skuCache = new Map<string, Product>();
  private barcodeCache = new Map<string, Product>();
  private idCache = new Map<string, Product>();

  constructor(
    private readonly productRepo: {
      findById(id: string): Promise<Product | null>;
      findBySku(sku: string): Promise<Product | null>;
      findByBarcode(barcode: string): Promise<Product | null>;
    }
  ) {}

  // =====================
  // MAIN FAST LOOKUP
  // =====================
  async find(query: {
    id?: string;
    sku?: string;
    barcode?: string;
  }): Promise<Product | null> {
    const { id, sku, barcode } = query;

    // =====================
    // 1. CACHE HIT (FASTEST)
    // =====================
    if (id && this.idCache.has(id)) {
      return this.idCache.get(id)!;
    }

    if (sku && this.skuCache.has(sku)) {
      return this.skuCache.get(sku)!;
    }

    if (barcode && this.barcodeCache.has(barcode)) {
      return this.barcodeCache.get(barcode)!;
    }

    // =====================
    // 2. DIRECT LOOKUP
    // =====================
    let product: Product | null = null;

    if (id) {
      product = await this.productRepo.findById(id);
    } else if (sku) {
      product = await this.productRepo.findBySku(sku);
    } else if (barcode) {
      product = await this.productRepo.findByBarcode(barcode);
    }

    if (!product) {
      return null;
    }

    // =====================
    // 3. CACHE STORE
    // =====================
    this.idCache.set(product.id, product);
    this.skuCache.set(product.sku, product);

    if (product.barcode) {
      this.barcodeCache.set(product.barcode, product);
    }

    return product;
  }

  // =====================
  // CACHE WARMUP (OPTIONAL)
  // =====================
  warmCache(products: Product[]) {
    for (const p of products) {
      this.idCache.set(p.id, p);
      this.skuCache.set(p.sku, p);

      if (p.barcode) {
        this.barcodeCache.set(p.barcode, p);
      }
    }
  }

  // =====================
  // CACHE CLEAR (FOR CONSISTENCY)
  // =====================
  clearCache() {
    this.idCache.clear();
    this.skuCache.clear();
    this.barcodeCache.clear();
  }
}