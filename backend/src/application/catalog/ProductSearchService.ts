type Product = {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
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
      search(query: string): Promise<Product[]>;
    }
  ) {}

  async find(query: {
    id?: string;
    sku?: string;
    barcode?: string;
  }): Promise<Product | null> {
    const { id, sku, barcode } = query;

    if (id && this.idCache.has(id)) {
      return this.idCache.get(id)!;
    }

    if (sku && this.skuCache.has(sku)) {
      return this.skuCache.get(sku)!;
    }

    if (barcode && this.barcodeCache.has(barcode)) {
      return this.barcodeCache.get(barcode)!;
    }

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

    this.cacheProduct(product);

    return product;
  }

  async search(query: string): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return this.productRepo.search(query);
  }

  private cacheProduct(product: Product) {
    this.idCache.set(product.id, product);
    this.skuCache.set(product.sku, product);

    if (product.barcode) {
      this.barcodeCache.set(product.barcode, product);
    }
  }

  warmCache(products: Product[]) {
    for (const p of products) {
      this.cacheProduct(p);
    }
  }

  clearCache() {
    this.idCache.clear();
    this.skuCache.clear();
    this.barcodeCache.clear();
  }
}