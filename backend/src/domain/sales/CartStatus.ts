export enum CartStatus {
  ACTIVE = "ACTIVE",

  // cart is locked after successful checkout
  LOCKED = "LOCKED",

  // cart expired due to inactivity
  EXPIRED = "EXPIRED",
}