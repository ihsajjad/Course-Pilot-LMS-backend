/**
 * Title: Swagger Documentation Configuration
 * Description: This file sets up Swagger documentation for the Node.js Express API, providing detailed documentation of available endpoints, request parameters, and responses.
 * Author: MD Iftekher Hossen Sajjad
 * Date: 7/5/2025
 */

import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";

import { version } from "../../../package.json";
import swaggerUi from "swagger-ui-express";
import authDocs from "./auth.docs";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CoursePilot LMS API",
      description:
        "API documentation for CoursePilot LMS. Note: Auth endpoints use cookies, which aren't supported by Swagger UI for testing.",
      version,
    },
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "auth_token" },
      },
      schemas: {
        // user data schema
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "MongoDB ObjectId of the user",
            },
            name: {
              type: "string",
              description: "Full name of the user",
              example: "Tanvir Siddique",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "Hashed password (stored securely)",
            },
            profile: {
              type: "string",
              format: "uri",
              description: "Profile picture URL (Cloudinary)",
            },
            role: {
              type: "string",
              enum: ["Admin", "User"],
              default: "User",
            },
            enrolledCourses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  courseId: {
                    type: "string",
                    description: "The ID of the enrolled course",
                    example: "6642ff5fa1bce946f0dbe85b",
                  },
                  enrolledAt: {
                    type: "string",
                    format: "date-time",
                    description: "The ISO date when the user enrolled",
                    example: "2024-06-28T12:00:00Z",
                  },
                  completedLectures: {
                    type: "array",
                    description:
                      "Array of completed lecture IDs for this course",
                    items: {
                      type: "string",
                      example: "lecture123",
                    },
                  },
                },
                required: ["courseId", "enrolledAt", "completedLectures"],
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Lecture data schema
        Lecture: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Lecture ID",
              example: "66431be0d7e4c345f6c8fa11",
            },
            title: {
              type: "string",
              description: "Lecture title",
              example: "Introduction to JavaScript",
            },
            videoUrl: {
              type: "string",
              description: "Video URL (e.g. YouTube embed or Cloudinary)",
              example: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            },
            resources: {
              type: "array",
              description: "Array of resource links (PDFs, docs, etc.)",
              items: {
                type: "string",
                example: "https://example.com/resource.pdf",
              },
            },
          },
          required: ["_id", "title", "videoUrl", "resources"],
        },
        Module: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Module ID",
              example: "66431c33d7e4c345f6c8fa22",
            },
            title: {
              type: "string",
              description: "Module title",
              example: "Module 1: Basics of JavaScript",
            },
            lectures: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Lecture",
              },
            },
          },
          required: ["_id", "title", "lectures"],
        },
        Course: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Course ID",
              example: "66431c5cd7e4c345f6c8fa55",
            },
            title: {
              type: "string",
              description: "Course title",
              example: "Complete JavaScript Bootcamp",
            },
            description: {
              type: "string",
              description: "Full course description",
              example:
                "A comprehensive course to master JavaScript for web development.",
            },
            price: {
              type: "number",
              description: "Course price in your local currency",
              example: 499,
            },
            thumbnail: {
              type: "string",
              description: "Cloudinary image URL or course cover",
              example:
                "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
            },
            modules: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Module",
              },
            },
          },
          required: [
            "_id",
            "title",
            "description",
            "price",
            "thumbnail",
            "modules",
          ],
        },
      },
    },
    security: [{ cookieAuth: [] }],
    paths: {...authDocs},
  },
  apis: ["../routes/*.ts", "../models/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
  const port = process.env.PORT || 5000;

  // Swagger UI page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
