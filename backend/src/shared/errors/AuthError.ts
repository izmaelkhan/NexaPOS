import { DomainError } from "../../domain/shared/DomainError";

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid credentials", "INVALID_CREDENTIALS");
  }
}

export class UserInactiveError extends DomainError {
  constructor() {
    super("User is inactive", "USER_INACTIVE");
  }
}

export class UnauthorizedAccessError extends DomainError {
  constructor() {
    super("Unauthorized access", "UNAUTHORIZED_ACCESS");
  }
}