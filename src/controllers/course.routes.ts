import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { uploadImage } from "../lib/utils";
import CourseModel from "../models/course.model";

export const handleCreteCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    // validate user data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // cheking the profile exist or not
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    // uploading the thumbnail to the cloudinary and getting the link
    const thumbnail = await uploadImage(file);

    const newCourse = new CourseModel({ ...courseData, thumbnail });
    await newCourse.save();

    res.json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
