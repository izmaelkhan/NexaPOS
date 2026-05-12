export class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "DOMAIN_ERROR") {
    super(message);

    this.name = "DomainError";
    this.code = code;

    // Maintains proper stack trace (important for Node.js debugging)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}