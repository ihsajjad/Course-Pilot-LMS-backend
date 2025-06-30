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

export const validateCreateCourseData = () => {
  return [
    check("title", "Title is required!").isString(),
    check("price", "Price is required!").isNumeric().isLength({ min: 0 }),
    check("description", "Description is required!").isString(),
  ];
};
