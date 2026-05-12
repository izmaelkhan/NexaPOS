import *as jwt from "jsonwebtoken";

export class JwtService {
  private static readonly secret =
    process.env.JWT_SECRET || "dev_secret_key";

  private static readonly expiresIn = "1d";

  /**
   * Sign JWT token
   */
  static sign(payload: {
    userId: string;
    email: string;
    role: string;
  }): string {
    if (!payload.userId || !payload.email || !payload.role) {
      throw new Error("Invalid token payload");
    }

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  /**
   * Verify JWT token
   */
  static verify(token: string): any {
    if (!token) {
      throw new Error("Token missing");
    }

    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }
}