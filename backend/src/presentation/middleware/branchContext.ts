import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export interface BranchRequest extends AuthRequest {
  activeBranchId?: string;
}

/**
 * Branch Context Middleware
 * Attaches active branch to request object
 */
export function branchContext(
  req: BranchRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // =====================
    // 1. Ensure user exists (authMiddleware must run first)
    // =====================
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: user not found",
      });
    }

    // =====================
    // 2. Extract active branch
    // =====================
    const activeBranchId =
      req.user.activeBranchId ||
      req.headers["x-branch-id"] ||
      req.body?.branchId;

    if (!activeBranchId) {
      return res.status(400).json({
        message: "Active branch is required",
      });
    }

    // =====================
    // 3. Attach to request
    // =====================
    req.activeBranchId = String(activeBranchId);

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Branch context error",
    });
  }
}