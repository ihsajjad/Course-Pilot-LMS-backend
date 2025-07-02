import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose, { SortOrder } from "mongoose";
import { uploadImage, uploadPDF } from "../lib/utils";
import CourseModel from "../models/course.model";
import { CourseType } from "../types/types";

export const creteCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    // validate user data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // cheking the thumbnail exist or not
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

export const getCourses = async (req: Request, res: Response) => {
  try {
    const text = req.query.text as string;
    const sortOption = req.query.sortByPrice as string;

    const query = {
      $or: [
        { title: new RegExp(text, "i") },
        { description: new RegExp(text, "i") },
      ],
    };

    const sort: { price: SortOrder } = { price: 1 }; // Default: Low to High
    if (sortOption === "price HtoL") {
      sort.price = -1;
    }

    const total = await CourseModel.countDocuments(query);

    const cardSize = 9;
    let pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");

    // if courses less than 5 then the page number should be 1
    if (total <= cardSize) pageNumber = 1;

    const skip = (pageNumber - 1) * cardSize;

    const courses = await CourseModel.find(query)
      .skip(skip)
      .limit(cardSize)
      .sort(sort);

    const response = {
      courses,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / cardSize),
      },
    };

    res.json(response);
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body as CourseType;
    // validate user data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // if the file exist that means thumbnail is updated
    const file = req.file as Express.Multer.File;
    if (file) {
      // uploading the thumbnail to the cloudinary and getting the link
      const newThumbnail = await uploadImage(file);
      courseData.thumbnail = newThumbnail;
    }

    const { _id, title, description, thumbnail, price } = courseData;

    if (!_id) {
      return res.json({
        success: false,
        message: "Invalid course id",
      });
    }

    await CourseModel.findByIdAndUpdate(_id, {
      $set: { title, description, thumbnail, price },
    });

    res.json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;
    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Course id is required!" });
    }

    const course = await CourseModel.findById(_id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: `Course doesn't exist for ${_id}` });
    }

    res.json(course);
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteCourseById = async (req: Request, res: Response) => {
  try {
    const _id = req.params._id;
    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Course id is required!" });
    }

    const course = await CourseModel.findByIdAndDelete(_id);
    if (!course?.$isDeleted) {
      return res.json({
        success: false,
        message: `Failed to delete the course`,
      });
    }

    res.json({ success: true, message: `Course deleted successfully` });
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

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

    return res.json(pdfLink);
  } catch (error: any) {
    console.log("handlUploadPdf error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
