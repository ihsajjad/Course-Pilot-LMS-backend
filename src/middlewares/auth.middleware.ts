import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import UserModel from "../models/user.model";
import { CurrentUser } from "../types/types";

declare global {
  namespace Express {
    interface Request {
      user: CurrentUser;
    }
  }
}

// to verify jwt token from cookie
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

        const jwtUser = decoded as CurrentUser;

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


// To verify admin or not
export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isAdmin = req.user.role === "Admin";
  if (!isAdmin) return res.status(401).json({ message: "Unauthorized access" });

  next();
};