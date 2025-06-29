import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import {
  CourseProgressType,
  EnrolledCourseType,
  LectureProgressType,
  UserType,
} from "../types/types";

const LectureProgressSchema = new Schema<LectureProgressType>(
  {
    lectureId: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const CourseProgressSchema = new Schema<CourseProgressType>(
  {
    courseId: { type: String, required: true },
    completedLectures: { type: [LectureProgressSchema], default: [] },
  },
  { _id: false }
);

const EnrolledCourseSchema = new Schema<EnrolledCourseType>(
  {
    courseId: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: CourseProgressSchema, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: String },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    enrolledCourses: { type: [EnrolledCourseSchema], default: [] },
  },
  { timestamps: true }
);

// hashing the password before storing to the database
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const UserModel = mongoose.model<UserType>("User", UserSchema);

export default UserModel;
