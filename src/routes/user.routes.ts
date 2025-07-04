import express from "express";
import { getCourseProgressById } from "../controllers/user.controllers";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/course-progress/:courseId", verifyToken, getCourseProgressById);

export default router;
