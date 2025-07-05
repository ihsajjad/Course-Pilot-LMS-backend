import { Request, Response } from "express";
import CourseModel from "../models/course.model";
import UserModel from "../models/user.schema";

export const getCourseProgressById = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    if (!courseId) {
      return res.json({
        success: false,
        message: "CourseId is required!",
      });
    }
    const jwtUser = req.user;

    const userData = await UserModel.findById(jwtUser._id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const courseProgress =
      userData.enrolledCourses.find((item) => item.courseId === courseId) || {};

    return res.json(courseProgress);
  } catch (error: any) {
    console.log("getCourseProgressById error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const putCompletedLectureId = async (req: Request, res: Response) => {
  try {
    const { courseId, lectureId } = req.body;

    if (!courseId || !lectureId) {
      return res.json({
        success: false,
        message: "CourseId and LectureId are required!",
      });
    }

    const jwtUser = req.user;

    const userData = await UserModel.findOneAndUpdate(
      {
        _id: jwtUser._id,
        "enrolledCourses.courseId": courseId,
      },
      {
        $addToSet: {
          "enrolledCourses.$[course].completedLectures": lectureId,
        },
      },
      {
        arrayFilters: [{ "course.courseId": courseId }],
        new: true,
      }
    );

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Failed to add lecture Id!",
      });
    }

    return res.json({
      success: true,
      message: "Lecture Id added successfully",
    });
  } catch (error: any) {
    console.error("addCompletedLectureId error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// To get user's enrolled courses
export const getMyCoursesByIds = async (req: Request, res: Response) => {
  try {
    const { courseIds } = req.body as { courseIds: string[] };

    if (!courseIds || !Array.isArray(courseIds)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid courseIds array" });
    }

    const jwtUser = req.user;

    const courses = await CourseModel.find({
      _id: { $in: jwtUser.enrolledCourseIds },
    });

    res.json(courses);
  } catch (error) {
    console.error("getMyCoursesByIds error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
