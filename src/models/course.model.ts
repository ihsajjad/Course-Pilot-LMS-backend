import mongoose, { Schema } from "mongoose";

// LectureResource Schema
const LectureResourceSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

// Lecture Schema
const LectureSchema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  resources: [LectureResourceSchema],
  isLocked: { type: Boolean, default: true },
  isCompleted: { type: Boolean, default: false },
});

// Module Schema
const ModuleSchema = new Schema({
  title: { type: String, required: true },
  lectures: [LectureSchema],
});

// CourseContent Schema
const CourseSchema = new Schema(
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

const CourseModel = mongoose.model("Course", CourseSchema);

export default CourseModel;
