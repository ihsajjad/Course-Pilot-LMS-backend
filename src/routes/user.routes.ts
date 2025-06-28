import express from "express";
import { handleLogin, handleRegister } from "../controllers/user.controllers";
import {
    validateLoginData,
    validateRegisterData,
} from "../lib/input-validator";

const router = express.Router();

router.post("/register", validateRegisterData(), handleRegister);
router.post("/login", validateLoginData(), handleLogin);

export default router;
