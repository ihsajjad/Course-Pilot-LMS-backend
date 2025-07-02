import mongoose, { Schema } from "mongoose";
import { CourseType, LectureType, ModuleType } from "../types/types";

// Lecture Schema
const LectureSchema = new Schema<LectureType>({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  resources: [{ type: String }],
});

// Module Schema
const ModuleSchema = new Schema<ModuleType>({
  title: { type: String, required: true },
  lectures: [LectureSchema],
});

// CourseContent Schema
const CourseSchema = new Schema<CourseType>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    modules: [ModuleSchema],
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model<CourseType>("Course", CourseSchema);

export default CourseModel;
