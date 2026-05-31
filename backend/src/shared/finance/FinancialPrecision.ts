export class FinancialPrecision {
  /**
   * ALWAYS enforce 2 decimal currency precision
   */
  static normalize(amount: number): number {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  }

  /**
   * Safe addition (prevents floating errors)
   */
  static add(a: number, b: number): number {
    return this.normalize(
      this.normalize(a) + this.normalize(b)
    );
  }

  /**
   * Safe subtraction
   */
  static subtract(a: number, b: number): number {
    return this.normalize(
      this.normalize(a) - this.normalize(b)
    );
  }

  /**
   * Safe multiplication
   */
  static multiply(a: number, b: number): number {
    return this.normalize(
      this.normalize(a) * this.normalize(b)
    );
  }

  /**
   * Compare values safely
   */
  static equals(a: number, b: number): boolean {
    return this.normalize(a) === this.normalize(b);
  }
}