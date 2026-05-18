import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";
import { RoleType } from "../../domain/identity/Roles";

const router = express.Router();

// GET branches
router.get(
  "/",
  authMiddleware,
  roleGuard([RoleType.ADMIN, RoleType.MANAGER]),
  async (req, res) => {
    res.json({
      message: "Branches fetched",
    });
  }
);

// CREATE branch
router.post(
  "/",
  authMiddleware,
  roleGuard([RoleType.ADMIN]),
  async (req, res) => {
    res.json({
      message: "Branch created",
      data: req.body,
    });
  }
);

export default router;