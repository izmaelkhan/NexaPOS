type ProductCacheItem = {
  id: string;
  name: string;
  sku: string;
  barcode?: string | null;
};

export class ProductCache {
  private static cache = new Map<string, ProductCacheItem>();

  // key can be sku OR barcode
  static set(key: string, product: ProductCacheItem) {
    this.cache.set(key, product);
  }

  static get(key: string): ProductCacheItem | null {
    return this.cache.get(key) || null;
  }

  static clear() {
    this.cache.clear();
  }
}