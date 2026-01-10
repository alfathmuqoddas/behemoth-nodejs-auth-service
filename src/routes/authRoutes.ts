import { Router } from "express";
import {
  register,
  login,
  getUserDetails,
  updateUserDetails,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserDetails);
router.put("/user/:id", authMiddleware, updateUserDetails);

export default router;
