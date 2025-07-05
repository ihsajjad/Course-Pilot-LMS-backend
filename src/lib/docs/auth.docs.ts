/**
 * Title: User Documentation
 * Description: This file contains comprehensive documentation for user management, covering endpoints, request parameters, and response formats related to user authentication, and registration.
 * Author: MD Iftekher Hossen Sajjad
 * Date: 7/5/2025
 */

export default {
  "/api/auth/register": {
    post: {
      summary: "Create an user account.",
      description:
        "Create an user account with these data: fullName, email, and password.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Full name of the user",
                },
                email: {
                  type: "string",
                  format: "email",
                },
                password: {
                  type: "string",
                  format: "password",
                },
                profile: {
                  type: "string",
                  format: "binary",
                  description: "Profile picture less than 2 MB",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User was created successfully",
        },
        "400": {
          description: "Bad request. Invalid user data provided.",
        },
        "500": {
          description: "Internal server error",
        },
      },
      tags: ["User"],
      security: [{ cookieAuth: [] }],
    },
  },
  "/api/auth/login": {
    post: {
      summary: "Login account",
      description:
        "Login your account with the valid email and password. These are the admin credentials: email: 'admin@gmail.com', password: 'pas'",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "Email address of the user",
                  example: "john@example.com",
                },
                password: {
                  type: "string",
                  description: "Password of the user",
                  example: "password",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User login successfull",
        },
        "400": {
          description: "Bad request. Invalid user credentials",
        },
        "500": {
          description: "Internal server error",
        },
      },
      tags: ["User"],
      security: [{ cookieAuth: [] }],
    },
  },
  "/api/auth/logout": {
    post: {
      summary: "Logout user",
      description: "Logout user account",
      responses: {
        "200": {
          description: "User logout successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                  },
                },
                required: ["message"],
              },
            },
          },
        },
        "500": {
          description: "Internal server error",
        },
      },
      tags: ["User"],
      security: [{ cookieAuth: [] }],
    },
  },
  "/api/auth/current": {
    get: {
      summary: "Current User",
      description: "Get the current logged user data.",
      responses: {
        "200": {
          description: "Got current user",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
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
                    enrolledCourseIds: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
                required: [],
              },
            },
          },
        },
        "500": {
          description: "Internal server error",
        },
      },
      tags: ["User"],
      security: [{ cookieAuth: [] }],
    },
  },
};
