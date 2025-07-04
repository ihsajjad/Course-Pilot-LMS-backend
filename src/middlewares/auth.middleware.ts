import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "../models/user.schema";

interface JWTUser {
  email: string;
  role: "User" | "Admin";
  name: string;
  profile: string;
  enrolledCourses: string[];
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JWTUser;
    }
  }
}
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["auth_token"];

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      async (
        error: VerifyErrors | null,
        decoded: JwtPayload | string | undefined
      ) => {
        if (error)
          return res.status(401).json({ message: "Unauthorized access" });

        const jwtUser = decoded as JWTUser;

        const user = await UserModel.findById(jwtUser._id);
        if (!user)
          return res.status(401).json({ message: "Unauthorized access" });

        // setting user data to req to get in other routes
        req.user = jwtUser;

        next();
      }
    );
  } catch (error) {
    console.log(__filename, error);
    res.status(500).json({ message: "Internal server error" });
  }
};
