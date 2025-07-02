import mongoose, { Document, ObjectId } from "mongoose";

export type LectureProgressType = {
  lectureId: string;
  isCompleted: boolean;
};

export type CourseProgressType = {
  courseId: string;
  completedLectures: LectureProgressType[]; // per lecture tracking
};

export type EnrolledCourseType = {
  courseId: string;
  enrolledAt: Date; // ISO date string
};

export interface UserType extends Document {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed
  profile?: string; // Cloudinary URL or optional fallback
  role: "Admin" | "User";
  enrolledCourses: EnrolledCourseType[];
  progress: CourseProgressType[];
  createdAt: string;
  updatedAt: string;
}

// types/lecture.ts

export type LectureType = {
  _id: string;
  title: string;
  videoUrl: string;
  resources: string[];
};

export type ModuleType = {
  _id: mongoose.Types.ObjectId;
  title: string; // e.g. "Module 1: Introduction"
  lectures: LectureType[];
};

export interface CourseType extends Document {
  _id: string;
  title: string; // Course title
  description: string; // Full course description
  price: number; // e.g. 499.00
  thumbnail: string; // Cloudinary image URL
  modules: ModuleType[];
}
