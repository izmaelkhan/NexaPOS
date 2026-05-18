export class Branch {
  public readonly id: string;
  public storeId: string;
  public name: string;
  public location: string;
  public isMainBranch: boolean;

  constructor(params: {
    id: string;
    storeId: string;
    name: string;
    location: string;
    isMainBranch?: boolean;
  }) {
    const { id, storeId, name, location, isMainBranch = false } = params;

    if (!storeId) {
      throw new Error("StoreId is required");
    }

    if (!name || name.trim().length < 2) {
      throw new Error("Branch name is too short");
    }

    if (!location || location.trim().length < 3) {
      throw new Error("Invalid branch location");
    }

    this.id = id;
    this.storeId = storeId;
    this.name = name.trim();
    this.location = location.trim();
    this.isMainBranch = isMainBranch;
  }

  // =====================
  // Domain Behavior
  // =====================

  rename(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error("Branch name is too short");
    }
    this.name = name.trim();
  }

  updateLocation(location: string) {
    if (!location || location.trim().length < 3) {
      throw new Error("Invalid branch location");
    }
    this.location = location.trim();
  }

  setAsMainBranch() {
    this.isMainBranch = true;
  }

  unsetMainBranch() {
    this.isMainBranch = false;
  }

  assignToStore(storeId: string) {
    if (!storeId) {
      throw new Error("StoreId is required");
    }
    this.storeId = storeId;
  }

  belongsToStore(storeId: string): boolean {
    return this.storeId === storeId;
  }
}