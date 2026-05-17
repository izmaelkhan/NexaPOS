import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../infrastructure/security/JwtService";
import { JwtPayload } from "jsonwebtoken";

// Extend Express Request type
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
    // 1. Get Authorization header
    // =====================
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // =====================
    // 2. Extract token
    // =====================
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // =====================
    // 3. Verify token (Infrastructure layer)
    // =====================
    const decoded = JwtService.verify(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    // =====================
    // 4. Attach user to request
    // =====================
    req.user = decoded as JwtPayload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
}