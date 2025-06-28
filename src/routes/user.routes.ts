import express from "express";
import { handleLogin, handleRegister, logoutUser } from "../controllers/user.controllers";
import {
    validateLoginData,
    validateRegisterData,
} from "../lib/input-validator";

const router = express.Router();

router.post("/register", validateRegisterData(), handleRegister);
router.post("/login", validateLoginData(), handleLogin);
router.get("/logout", logoutUser);

export default router;
