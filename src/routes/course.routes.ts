import express from "express";
import { handleCreteCourse } from "../controllers/course.routes";
import { upload } from "../lib/utils";
import { validateCreateCourseData } from "../middlewares/validator.middleware";

const router = express.Router();

router.post(
  "/create",
  upload.single("thumbnail"),
  validateCreateCourseData(),
  handleCreteCourse
);

export default router;
