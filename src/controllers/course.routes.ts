import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { uploadImage } from "../lib/utils";
import CourseModel from "../models/course.model";
import { SortOrder } from "mongoose";
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
