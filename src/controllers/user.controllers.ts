import { Request, Response } from "express";
import { validationResult } from "express-validator";
import UserModel from "../models/user.schema";
import { UserType } from "../types/types";
import { generateJWTToken } from "../lib/utils";
import bcrypt from "bcrypt";

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const user = req.body as UserType;

    // validate user data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const isAlreadyExist = await UserModel.findOne({ email: user.email });

    if (isAlreadyExist) {
      return res.json({ success: false, message: "User already exist!" });
    }

    const newUser = new UserModel(user);
    await newUser.save();

    // built-in utils function to generate token
    const token = generateJWTToken(newUser._id, user.role);

    res.cookie("auth_token", token, {
      httpOnly: true,
      expires: new Date(86400000),
    });

    newUser.password = "";
    return res.status(201).json(newUser);
  } catch (error: any) {
    console.log(__dirname, error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const loginData = req.body;

    // validate user data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const user = await UserModel.findOne({ email: loginData.email });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const isMatchedPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isMatchedPassword)
      return res.status(400).json({ message: "Invalid password" });

    // built-in utils function to generate token
    const token = generateJWTToken(user?._id.toString(), user.role);

    // setting token to the browser cookie for authentication
    res.cookie("auth_token", token, {
      httpOnly: true,
      expires: new Date(86400000),
    });

    res.json({ message: "User login successfull" });
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
      .json({ message: "User logged out successfull" });
  } catch (error) {
    console.log(__filename, error);
    res.status(500).json({ message: "Internal server error" });
  }
};
