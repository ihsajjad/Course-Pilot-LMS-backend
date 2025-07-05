/*
 * Title: Course Pilot LMS Project - Index File
 * Description: This file serves as the entry point for the Node.js Express application. It initializes the server and sets up routing and middleware.
 * Project Name : Course Pilot LMS
 * Author: MD Iftekher Hossen Sajjad
 * Date: 28/6/2025
 * Cmergency Contact: ihsajjad1@gmail.com, 01725790334 (Whatsapp)
 */

import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
const app = express();

/* ROUTE IMPORTS */
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import userRoutes from "./routes/user.routes";

/* CONFIGURATIONS */
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.BASE_CLIENT, credentials: true }));
app.use(express.json());

/* MONGOOSE CONNECTION */
mongoose
  .connect(process.env.MONGODB_URI as string, { dbName: process.env.DB_NAME })
  .then(() => console.log(`DB is connected ${process.env.DB_NAME}`))
  .catch((err) =>
    console.error(`${process.env.DB_NAME} connection error:`, err)
  );

/* CLOUDINARY CONNECTION*/
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

/* SERVER */
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port : ${port}`));
