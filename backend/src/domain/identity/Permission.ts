export enum PermissionType {
  CREATE_SALE = "CREATE_SALE",
  DELETE_PRODUCT = "DELETE_PRODUCT",
  VIEW_REPORTS = "VIEW_REPORTS",
}

export class Permission {
  public readonly id: string;
  public readonly name: PermissionType;

  constructor(params: {
    id: string;
    name: PermissionType;
  }) {
    const { id, name } = params;

    // =====================
    // Business Rules
    // =====================

    if (!Object.values(PermissionType).includes(name)) {
      throw new Error("Invalid permission type");
    }

    this.id = id;
    this.name = name;
  }

  isCreateSale(): boolean {
    return this.name === PermissionType.CREATE_SALE;
  }

  isDeleteProduct(): boolean {
    return this.name === PermissionType.DELETE_PRODUCT;
  }

  isViewReports(): boolean {
    return this.name === PermissionType.VIEW_REPORTS;
  }
}