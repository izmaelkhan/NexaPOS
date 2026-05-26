export interface InvoiceSequenceRepo {
  getNextSequence(branchId: string): Promise<number>;
  lockSequence?(branchId: string): Promise<void>;
}

export class InvoiceNumberGenerator {
  constructor(private readonly sequenceRepo: InvoiceSequenceRepo) {}

  async generate(branchId: string): Promise<string> {
    if (!branchId) {
      throw new Error("Branch ID is required");
    }

    const sequence = await this.sequenceRepo.getNextSequence(branchId);

    if (sequence <= 0) {
      throw new Error("Invalid sequence generated");
    }

    const year = new Date().getFullYear();
    const padded = String(sequence).padStart(6, "0");

    return `NXP-${year}-${padded}`;
  }
}