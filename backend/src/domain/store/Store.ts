export class Store {
  public readonly id: string;
  public name: string;
  public address: string;
  public isActive: boolean;

  constructor(params: {
    id: string;
    name: string;
    address: string;
    isActive?: boolean;
  }) {
    const { id, name, address, isActive = true } = params;

    if (!name || name.trim().length < 2) {
      throw new Error("Store name is too short");
    }

    if (!address || address.trim().length < 5) {
      throw new Error("Invalid store address");
    }

    this.id = id;
    this.name = name.trim();
    this.address = address.trim();
    this.isActive = isActive;
  }

  // =====================
  // Domain Behavior
  // =====================

  rename(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error("Store name is too short");
    }
    this.name = name.trim();
  }

  updateAddress(address: string) {
    if (!address || address.trim().length < 5) {
      throw new Error("Invalid store address");
    }
    this.address = address.trim();
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  isOperational(): boolean {
    return this.isActive;
  }
}