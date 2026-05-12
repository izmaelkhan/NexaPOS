import { User } from "./User";

export interface IUserRepository {
  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Save (create or update) user
   */
  save(user: User): Promise<void>;
}