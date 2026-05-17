import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { RoleType } from "../../domain/identity/Roles";

export function roleGuard(allowedRoles: RoleType[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // =====================
      // 1. Ensure user exists (must run after authMiddleware)
      // =====================
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized: No user found",
        });
      }

      const userRole = req.user.role as RoleType;

      // =====================
      // 2. Check role permission
      // =====================
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient role permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Role guard error",
      });
    }
  };
}