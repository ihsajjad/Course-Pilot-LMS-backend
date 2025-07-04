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
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

// To create new course
router.post(
  "/create",
  verifyToken,
  verifyAdmin,
  upload.single("thumbnail"),
  validateCourseData(),
  creteCourse
);

// To get all courses
router.get("/", getCourses);

// To update existing course
router.put(
  "/update",
  verifyToken,
  verifyAdmin,
  upload.single("newThumbnail"),
  validateCourseData(),
  updateCourse
);

router.get("/:_id", getCourseById); // To get course page data
router.get("/content/:_id", getCourseContentById); // To get course content
router.delete("/:_id", verifyToken, verifyAdmin, deleteCourseById);

// To create new module
router.post(
  "/module",
  verifyToken,
  verifyAdmin,
  validateCreateModuleData(),
  createModule
);

// To update an exsting module
router.put(
  "/module",
  verifyToken,
  verifyAdmin,
  validateUpdateModuleData(),
  updateModule
);

// To delete a module
router.delete(
  "/module/:courseId/:moduleId",
  verifyToken,
  verifyAdmin,
  deleteModuleById
);

// To create a Lecture
router.post(
  "/lecture",
  verifyToken,
  verifyAdmin,
  validateCreateLectureData(),
  createLecture
);

// To update an existing Lecture
router.put(
  "/lecture",
  verifyToken,
  verifyAdmin,
  validateUpdateLectureData(),
  updateLecture
);

// To delete a lecture
router.delete(
  "/lecture/:courseId/:moduleId/:lectureId",
  verifyToken,
  verifyAdmin,
  deleteLectureById
);

// To upload resources pdf
router.post("/upload-rsource", upload.single("pdf"), handlUploadPdf);

// To enroll course
router.post("/enroll", verifyToken, enrollCourse);

export default router;
