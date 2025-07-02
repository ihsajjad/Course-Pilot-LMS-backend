import express from "express";
import { createModule, updateModule } from "../controllers/module.controller";
import { validateCreateModuleData, validateUpdateModuleData } from "../middlewares/validator.middleware";

const router = express.Router();

router.post("/", validateCreateModuleData(), createModule);
router.put("/", validateUpdateModuleData(), updateModule);

export default router;
