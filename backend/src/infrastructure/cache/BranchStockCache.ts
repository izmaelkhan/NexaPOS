type BranchStockCacheItem = {
  productId: string;
  branchId: string;
  stock: number;
};

export class BranchStockCache {
  private static cache = new Map<string, BranchStockCacheItem>();

  static buildKey(productId: string, branchId: string): string {
    return `${productId}:${branchId}`;
  }

  static set(item: BranchStockCacheItem) {
    const key = this.buildKey(item.productId, item.branchId);
    this.cache.set(key, item);
  }

  static get(productId: string, branchId: string): BranchStockCacheItem | null {
    const key = this.buildKey(productId, branchId);
    return this.cache.get(key) || null;
  }

  static clear() {
    this.cache.clear();
  }
}