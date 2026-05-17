import { Request, Response } from "express";
import { LoginUseCase } from "../../application/auth/LoginUseCase";

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  handle = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const result = await this.loginUseCase.execute({
        email,
        password,
      });

      return res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      console.error("LOGIN_CONTROLLER_ERROR:", error);

      return res.status(401).json({
        message: error.message || "Authentication failed",
      });
    }
  };
}