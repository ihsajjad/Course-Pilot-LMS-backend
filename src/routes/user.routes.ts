import express from "express";
import { handleRegister } from "../controllers/user.controllers";
import { validateRegisterData } from "../lib/input-validator";

const router = express.Router();

router.post("/register", validateRegisterData(), handleRegister);

export default router;
