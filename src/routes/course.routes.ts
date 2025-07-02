import express from "express";
import {
  createModule,
  creteCourse,
  getCourseById,
  getCourses,
  updateCourse,
  updateModule,
} from "../controllers/course.routes";
import { upload } from "../lib/utils";
import {
  validateCourseData,
  validateCreateModuleData,
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

router.post("/module", validateCreateModuleData(), createModule);
router.put("/module", validateUpdateModuleData(), updateModule);

export default router;
