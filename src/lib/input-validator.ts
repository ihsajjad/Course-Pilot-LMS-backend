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
