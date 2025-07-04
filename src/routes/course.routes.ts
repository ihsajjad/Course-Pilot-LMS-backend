import express from "express";
import {
  createLecture,
  createModule,
  creteCourse,
  deleteCourseById,
  deleteLectureById,
  deleteModuleById,
  enrollCourse,
  getCourseById,
  getCourseContentById,
  getCourses,
  handlUploadPdf,
  updateCourse,
  updateLecture,
  updateModule,
} from "../controllers/course.controllers";
import { upload } from "../lib/utils";
import {
  validateCourseData,
  validateCreateLectureData,
  validateCreateModuleData,
  validateUpdateLectureData,
  validateUpdateModuleData,
} from "../middlewares/validator.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/create",
  upload.single("thumbnail"),
  validateCourseData(),
  creteCourse
);

router.get("/", getCourses); //getting all courses

router.put(
  "/update",
  upload.single("newThumbnail"),
  validateCourseData(),
  updateCourse
);

router.get("/:_id", getCourseById); // to get course page data
router.get("/content/:_id", getCourseContentById); // to get course content
router.delete("/:_id", deleteCourseById);

// Module routes
router.post("/module", validateCreateModuleData(), createModule);
router.put("/module", validateUpdateModuleData(), updateModule);
router.delete("/module/:courseId/:moduleId", deleteModuleById);

// Lecture routes
router.post("/lecture", validateCreateLectureData(), createLecture);
router.put("/lecture", validateUpdateLectureData(), updateLecture);
router.delete("/lecture/:courseId/:moduleId/:lectureId", deleteLectureById);

// To upload resources pdf
router.post("/upload-rsource", upload.single("pdf"), handlUploadPdf);

router.post("/enroll", verifyToken, enrollCourse);

export default router;
