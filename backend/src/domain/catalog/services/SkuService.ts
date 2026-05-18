export class SkuService {
  /**
   * Generates SKU in format: PROD-XXXX
   * Example: PROD-4821
   */
  static generate(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PROD-${random}`;
  }

  /**
   * Optional helper: generate multiple SKUs
   */
  static generateBatch(count: number): string[] {
    const skus = new Set<string>();

    while (skus.size < count) {
      skus.add(this.generate());
    }

    return Array.from(skus);
  }
}