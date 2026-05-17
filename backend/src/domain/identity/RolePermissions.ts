import { RoleType } from "./Roles";
import { PermissionType } from "./Permission";

/**
 * Role → Permissions mapping (RBAC core rules)
 */
export const RolePermissions: Record<RoleType, PermissionType[]> = {
  [RoleType.ADMIN]: [
    PermissionType.CREATE_SALE,
    PermissionType.DELETE_PRODUCT,
    PermissionType.VIEW_REPORTS,
  ],

  [RoleType.MANAGER]: [
    PermissionType.CREATE_SALE,
    PermissionType.VIEW_REPORTS,
  ],

  [RoleType.CASHIER]: [
    PermissionType.CREATE_SALE,
  ],
};

/**
 * Helper: check if role has permission
 */
export function hasPermission(role: RoleType, permission: PermissionType): boolean {
  if (!RolePermissions[role]) return false; // ✅ IMPORTANT FIX
  return RolePermissions[role].includes(permission);
}