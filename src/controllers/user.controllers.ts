import { Request, Response } from "express";
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

    return res.json({
      success: true,
      message: "Course progress found",
      courseProgress,
    });
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
