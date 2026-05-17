import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleGuard } from "../middleware/roleGuard";
import { RoleType } from "../../domain/identity/Roles";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleGuard([RoleType.ADMIN]),
  (req, res) => {
    res.json({
      message: "Products access granted",
    });
  }
);

export default router;