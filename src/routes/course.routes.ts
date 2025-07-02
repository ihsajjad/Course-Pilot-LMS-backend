import express from "express";
import {
  createLecture,
  createModule,
  creteCourse,
  deleteCourseById,
  getCourseById,
  getCourses,
  updateCourse,
  updateLecture,
  updateModule,
} from "../controllers/course.routes";
import { upload } from "../lib/utils";
import {
  validateCourseData,
  validateCreateLectureData,
  validateCreateModuleData,
  validateUpdateLectureData,
  validateUpdateModuleData,
} from "../middlewares/validator.middleware";

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

router.get("/:_id", getCourseById);
router.delete("/:_id", deleteCourseById);

// Module routes
router.post("/module", validateCreateModuleData(), createModule);
router.put("/module", validateUpdateModuleData(), updateModule);

// Lecture routes
router.post("/lecture", validateCreateLectureData(), createLecture);
router.put("/lecture", validateUpdateLectureData(), updateLecture);

export default router;
