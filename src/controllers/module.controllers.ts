import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import CourseModel from "../models/course.model";

// ================================ Module Controllers =========================================
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

export const updateModule = async (req: Request, res: Response) => {
  try {
    const { courseId, title, moduleId } = req.body as {
      courseId: string;
      title: string;
      moduleId: string;
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const updated = await CourseModel.updateOne(
      { _id: courseId, "modules._id": moduleId },
      { $set: { "modules.$.title": title } }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Module or Course not found or already up-to-date.",
      });
    }

    res.json({
      success: true,
      message: "Module updated successfully",
    });
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteModuleById = async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId } = req.params;

    if (!moduleId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Course and Module ID  is required!",
      });
    }

    const result = await CourseModel.updateOne(
      { _id: courseId },
      {
        $pull: {
          modules: { _id: moduleId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Module not found or already deleted",
      });
    }

    return res.json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error: any) {
    console.log("deleteModuleById error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
