import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { generateJWTToken, uploadImage } from "../lib/utils";
import UserModel from "../models/user.model";
import { CurrentUser, UserType } from "../types/types";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const user = req.body as UserType;

    // validate user data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // cheking the profile exist or not
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const isAlreadyExist = await UserModel.findOne({ email: user.email });
    if (isAlreadyExist) {
      return res.json({ success: false, message: "User already exist!" });
    }

    // uploading the profile to the cloudinary and getting the link
    const file_url = await uploadImage(file);
    user.profile = file_url;

    const newUser = new UserModel(user);
    await newUser.save();

    // built-in utils function to generate token
    const token = generateJWTToken(newUser);

    // setting token to the browser cookie for authentication
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 86400000,
    });

    const { name, email, profile, role, _id, enrolledCourses } = user;
    const data = { name, email, profile, role, _id, enrolledCourses };
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data,
    });
  } catch (error: any) {
    console.log(__dirname, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// user login
export const handleLogin = async (req: Request, res: Response) => {
  try {
    const loginData = req.body;

    // validate user data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const user = await UserModel.findOne({ email: loginData.email });
    if (!user) return res.json({ message: "User doesn't exist" });

    const isMatchedPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isMatchedPassword)
      return res.json({ success: false, message: "Password doesn't match!" });

    // built-in utils function to generate token
    const token = generateJWTToken(user);

    // setting token to the browser cookie for authentication
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 86400000,
    });

    const { name, email, profile, role, _id, enrolledCourses } = user;
    const data = { name, email, profile, role, _id, enrolledCourses };

    res.json({ success: true, message: "User login successful", data });
  } catch (error: any) {
    console.log(__dirname, error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// user logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    // remove the token from client's browser
    res
      .cookie("auth_token", "", { expires: new Date(0) })
      .json({ success: true, message: "Sign out successful" });
  } catch (error) {
    console.log(__filename, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get current user (To observe the logged user)
export const currentUser = async (req: Request, res: Response) => {
  try {
    // initializing user data
    let userData: CurrentUser = {
      _id: "",
      email: "",
      name: "",
      role: "",
      profile: "",
      enrolledCourseIds: [],
    };

    // remove the token from client's browser
    const token = req.cookies["auth_token"];
    if (!token) return res.json(userData);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    const { _id, name, email, role, profile, enrolledCourseIds } =
      decoded as CurrentUser;
    if (decoded) {
      userData.name = name;
      userData.email = email;
      userData.role = role;
      userData.profile = profile || "";
      userData.enrolledCourseIds = enrolledCourseIds;
      userData._id = _id;
    }

    res.json(userData);
  } catch (error) {
    console.log(__filename, error);
    res.status(500).json({ message: "Internal server error" });
  }
};
