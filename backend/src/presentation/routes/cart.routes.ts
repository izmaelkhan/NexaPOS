import express from "express";
import { Cart } from "../../domain/sales/Cart";

const router = express.Router();

/**
 * TEMP IN-MEMORY CART STORE
 */
const carts = new Map<string, Cart>();

// =====================
// POST /cart/create
// =====================
router.post("/create", (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ message: "customerId required" });
  }

  const cart = new Cart(customerId);
  carts.set(customerId, cart);

  return res.json({
    message: "Cart created",
    data: cart.getItems(),
  });
});

// =====================
// POST /cart/item
// =====================
router.post("/item", (req, res) => {
  const { customerId, productId, price, quantity } = req.body;

  const cart = carts.get(customerId);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  try {
    cart.addItem({ productId, price, quantity });

    return res.json({
      message: "Item added",
      data: cart.getItems(),
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

// =====================
// DELETE /cart/item/:id
// =====================
router.delete("/item/:id", (req, res) => {
  const { customerId } = req.body;
  const productId = req.params.id;

  const cart = carts.get(customerId);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  try {
    cart.removeItem(productId);

    return res.json({
      message: "Item removed",
      data: cart.getItems(),
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

export default router;