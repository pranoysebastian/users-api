import express from "express";
import { registerUser, loginUser, authGoogle } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/auth/google", authGoogle);

export default router;