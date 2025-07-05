import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { uploadPDF } from "../lib/utils";
import CourseModel from "../models/course.model";

// ================================ Lecture Controllers =========================================
export const createLecture = async (req: Request, res: Response) => {
  try {
    const { courseId, title, moduleId, videoUrl, resources } = req.body as {
      courseId: string;
      title: string;
      moduleId: string;
      videoUrl: string;
      resources: string[];
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const newLecture = {
      _id: new mongoose.Types.ObjectId(),
      title,
      videoUrl,
      resources,
    };

    const result = await CourseModel.updateOne(
      { _id: courseId, "modules._id": moduleId },
      { $push: { "modules.$.lectures": newLecture } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Course or Module not found",
      });
    }

    res.json({
      success: true,
      message: "Lecture created successfully",
    });
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateLecture = async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId, lectureId, title, videoUrl, resources } =
      req.body as {
        courseId: string;
        moduleId: string;
        lectureId: string;
        title: string;
        videoUrl: string;
        resources: string[];
      };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const result = await CourseModel.updateOne(
      { _id: courseId },
      {
        $set: {
          "modules.$[mod].lectures.$[lec].title": title,
          "modules.$[mod].lectures.$[lec].videoUrl": videoUrl,
          "modules.$[mod].lectures.$[lec].resources": resources,
        },
      },
      {
        arrayFilters: [{ "mod._id": moduleId }, { "lec._id": lectureId }],
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found or already updated",
      });
    }

    res.json({
      success: true,
      message: "Lecture updated successfully",
    });
  } catch (error: any) {
    console.log("updateLecture error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteLectureById = async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId, lectureId } = req.params;

    if (!moduleId || !courseId || !lectureId) {
      return res.status(400).json({
        success: false,
        message: "Course, Module, and Lecture ID are required!",
      });
    }

    const result = await CourseModel.updateOne(
      { _id: courseId },
      {
        $pull: {
          "modules.$[mod].lectures": { _id: lectureId },
        },
      },
      {
        arrayFilters: [{ "mod._id": moduleId }],
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found or already deleted",
      });
    }

    return res.json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error: any) {
    console.log("deleteLectureById error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handlUploadPdf = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required!",
      });
    }

    const pdfLink = await uploadPDF(file);

    return res.json({
      success: true,
      message: "PDF uploaded successfully",
      url: pdfLink,
    });
  } catch (error: any) {
    console.log("handlUploadPdf error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
