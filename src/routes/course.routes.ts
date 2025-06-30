import express from "express";
import {
    creteCourse,
    getCourses,
    updateCourse,
} from "../controllers/course.routes";
import { upload } from "../lib/utils";
import { validateCourseData } from "../middlewares/validator.middleware";

const router = express.Router();

router.post(
  "/create",
  upload.single("thumbnail"),
  validateCourseData(),
  creteCourse
);

router.get("/", getCourses);

router.put(
  "/update",
  upload.single("newThumbnail"),
  validateCourseData(),
  updateCourse
);

export default router;
