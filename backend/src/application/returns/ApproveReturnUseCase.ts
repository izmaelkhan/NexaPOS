export class ApproveReturnUseCase {
  constructor(private readonly returnRepo: any) {}

  async execute(returnId: string) {
    const returnRequest = await this.returnRepo.findById(returnId);

    if (!returnRequest) {
      throw new Error("Return not found");
    }

    const entity = returnRequest;

    entity.approve?.();

    await this.returnRepo.save(entity);

    return {
      returnId: entity.id,
      status: entity.status,
    };
  }
}