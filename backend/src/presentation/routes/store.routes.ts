import express from "express";

const router = express.Router();

// GET all stores
router.get("/", async (req, res) => {
  res.json({ message: "Stores fetched" });
});

// CREATE store
router.post("/", async (req, res) => {
  res.json({ message: "Store created", data: req.body });
});

export default router;