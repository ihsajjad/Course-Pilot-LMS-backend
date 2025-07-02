/*
 * Title: Course Pilot LMS Project - Index File
 * Description: This file serves as the entry point for the Node.js Express application. It initializes the server and sets up routing and middleware.
 * Project Name : Course Pilot LMS
 * Author: MD Iftekher Hossen Sajjad
 * Date: 28/6/2025
 */

import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

/* ROUTE IMPORTS */
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";

/* CONFIGURATIONS */
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
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

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

/* SERVER */
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port : ${port}`));
