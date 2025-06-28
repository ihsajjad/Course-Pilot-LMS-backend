import express from "express";
import { register } from "../controllers/user.controllers";
import { validateRegisterData } from "../lib/input-validator";

const router = express.Router();

router.post("/register", validateRegisterData(), register);

export default router;
