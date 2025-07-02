import express from "express";
import { createModule } from "../controllers/module.controller";
import { validateModuleData } from "../middlewares/validator.middleware";

const router = express.Router();

router.post("/", validateModuleData(), createModule);

export default router;
