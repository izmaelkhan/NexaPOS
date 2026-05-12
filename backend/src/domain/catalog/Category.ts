export class Category {
  public readonly id: string;
  public readonly name: string;

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const { id, name, createdAt, updatedAt } = params;

    if (!name || name.trim().length === 0) {
      throw new Error("Category name cannot be empty");
    }

    this.id = id;
    this.name = name.trim();

    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  rename(newName: string) {
    if (!newName || newName.trim().length === 0) {
      throw new Error("Category name cannot be empty");
    }

    (this as any).name = newName.trim();
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}