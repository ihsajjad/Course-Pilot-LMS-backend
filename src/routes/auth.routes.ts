import express from "express";
import {
    currentUser,
  handleLogin,
  handleRegister,
  logoutUser,
} from "../controllers/auth.controllers";
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
router.get("/current", currentUser);

export default router;
