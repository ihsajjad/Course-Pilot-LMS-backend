import express from "express";
import {
  handleLogin,
  handleRegister,
  logoutUser,
} from "../controllers/user.controllers";
import {
  validateLoginData,
  validateRegisterData,
} from "../lib/input-validator";
import { upload } from "../lib/utils";

const router = express.Router();

router.post(
  "/register",
  upload.single("profile"),
  validateRegisterData(),
  handleRegister
);
router.post("/login", validateLoginData(), handleLogin);
router.get("/logout", logoutUser);

export default router;
