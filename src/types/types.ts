import mongoose, { Document } from "mongoose";

export type EnrolledCourseType = {
  courseId: string;
  enrolledAt: Date; // ISO date string
  completedLectures: string[]; // per lecture tracking
};

export interface UserType extends Document {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed
  profile?: string; // Cloudinary URL or optional fallback
  role: "Admin" | "User";
  enrolledCourses: EnrolledCourseType[];
  createdAt: string;
  updatedAt: string;
}

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
