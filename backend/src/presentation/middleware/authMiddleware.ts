import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../infrastructure/security/JwtService";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: any;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // =====================
    // 1. Get token from header
    // =====================
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // =====================
    // 2. Verify token
    // =====================
    const decoded = JwtService.verify(token);

    // =====================
    // 3. Attach user to request
    // =====================
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}