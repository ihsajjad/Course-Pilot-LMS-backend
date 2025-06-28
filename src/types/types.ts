

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
  progress: CourseProgressType;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  avatar?: string; // Cloudinary URL or optional fallback
  role: "Admin" | "User";
  enrolledCourses: EnrolledCourseType[];
  createdAt: string;
  updatedAt: string;
};

// types/lecture.ts

export type LectureResourceType = {
  name: string;
  url: string; // PDF download/view link
};

export type LectureType = {
  id: string;
  title: string;
  videoUrl: string; // YouTube embed link or streaming URL
  resources: LectureResourceType[];
  isLocked: boolean;
  isCompleted: boolean;
};

export type ModuleType = {
  id: string;
  title: string;           // e.g. "Module 1: Introduction"
  lectures: LectureType[];
};

export type CourseContentType = {
  courseId: string;
  title: string;           // Course title
  description: string;     // Full course description
  price: number;           // e.g. 499.00
  thumbnail: string;       // Cloudinary image URL
  modules: ModuleType[];
};
