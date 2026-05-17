import { User } from "../../domain/identity/User";

export class UserMapper {
  static toDomain(raw: any) {
    return new User({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.password,
      roleId: raw.roleId,
      role: raw.role.name, // 👈 IMPORTANT
      isActive: true,
    });
  }
}