import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// =====================
// Switch active branch
// =====================
router.post("/", authMiddleware, async (req, res) => {
  const { branchId } = req.body;

  if (!branchId) {
    return res.status(400).json({
      message: "branchId is required",
    });
  }

  // In real system → store in DB or JWT refresh
  (req as any).user.activeBranchId = branchId;

  return res.json({
    message: "Branch switched successfully",
    activeBranchId: branchId,
  });
});

export default router;