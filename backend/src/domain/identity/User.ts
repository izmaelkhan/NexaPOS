import { RoleType } from "./Roles";

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly roleId: string;
  public readonly role: RoleType;
  public isActive: boolean;

  constructor(params: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    roleId: string;
    role: RoleType;
    isActive?: boolean;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.roleId = params.roleId;
    this.role = params.role;
    this.isActive = params.isActive ?? true;
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }
}