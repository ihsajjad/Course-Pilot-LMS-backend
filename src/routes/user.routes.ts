import express from "express";
import {
    getCourseProgressById,
    putCompletedLectureId,
} from "../controllers/user.controllers";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/course-progress/:courseId", verifyToken, getCourseProgressById); // to track the progress
router.put("/course-progress/", verifyToken, putCompletedLectureId); // once user complete a lecture add the lecture id here

export default router;
