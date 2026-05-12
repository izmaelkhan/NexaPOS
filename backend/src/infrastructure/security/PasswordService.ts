import * as bcrypt from "bcrypt";

export class PasswordService {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    if (!password || password.length < 6) {
      throw new Error("Password too weak");
    }

    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    if (!password || !hash) {
      throw new Error("Invalid credentials");
    }

    return await bcrypt.compare(password, hash);
  }
}