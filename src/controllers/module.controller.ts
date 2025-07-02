import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import CourseModel from "../models/course.model";

export const createModule = async (req: Request, res: Response) => {
  try {
    const { courseId, title } = req.body as { courseId: string; title: string };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course doesn't exist!",
      });
    }

    const module = {
      _id: new mongoose.Types.ObjectId(),
      title,
      lectures: [],
    };

    course.modules.push(module);
    await course.save();

    res.json({
      success: true,
      message: "Module crated successfully",
    });
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
