import { check } from "express-validator";

export const validateRegisterData = () => {
  return [
    check("name", "Name is required!").isString(),
    check("email", "Email is required!").isEmail(),
    check("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
};

export const validateLoginData = () => {
  return [
    check("email", "Email is required!").isEmail(),
    check("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
};

export const validateCourseData = () => {
  return [
    check("title", "Title is required!").isString(),
    check("price", "Price is required!").isNumeric().isLength({ min: 0 }),
    check("description", "Description is required!").isString(),
  ];
};

export const validateCreateModuleData = () => {
  return [
    check("title", "Title is required!").isString(),
    check("courseId", "courseId is required!").isString(),
  ];
};

export const validateUpdateModuleData = () => {
  return [
    check("title", "title is required!").isString(),
    check("courseId", "courseId is required!").isString(),
    check("moduleId", "moduleId is required!").isString(),
  ];
};


export const validateCreateLectureData = () => {
  return [
    check("title", "title is required!").isString(),
    check("courseId", "courseId is required!").isString(),
    check("moduleId", "moduleId is required!").isString(),
    check("videoUrl", "videoUrl is required!").isURL(),
  ];
};

// export const validateUpdateLectureData = () => {
//   return [
//     check("title", "title is required!").isString(),
//     check("courseId", "courseId is required!").isString(),
//     check("moduleId", "moduleId is required!").isString(),
//     check("lectureId", "lectureId is required!").isString(),
//     check("videoUrl", "videoUrl is required!").isURL(),
//   ];
// };