export default {
  "/api/courses/create": {
    post: {
      summary: "Create new course",
      description:
        "Create a new course with title, description, price, and thumbnail",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Course title",
                },
                description: {
                  type: "string",
                  description: "Course description",
                },
                price: {
                  type: "number",
                  description: "Course price",
                },
                thumbnail: {
                  type: "string",
                  format: "binary",
                  description: "Thumbnail must be less than 2 MB",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Course created successfully",
        },
        "400": {
          description: "Bad request. Invalid course data provided.",
        },
        "500": {
          description: "Internal server error",
        },
      },
      tags: ["Course"],
      security: [{ cookieAuth: [] }],
    },
  },
  "/api/courses/update": {
    put: {
      summary: "Update existing course",
      description:
        "Create a new course with title, description, price, and thumbnail",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "Course _id",
                },
                title: {
                  type: "string",
                  description: "Course title",
                },
                description: {
                  type: "string",
                  description: "Course description",
                },
                price: {
                  type: "number",
                  description: "Course price",
                },
                newThumbnail: {
                  type: "string",
                  format: "binary",
                  description: "newThumbnail must be less than 2 MB",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Course created successfully",
        },
        "400": {
          description: "Bad request. Invalid course data provided.",
        },
        "500": {
          description: "Internal server error",
        },
      },
      tags: ["Course"],
      security: [{ cookieAuth: [] }],
    },
  },
  // "/api/courses": {
  //   get: {
  //     summary: "Get courses",
  //     description:
  //       "Get all courses with the pagination",
  //     requestBody: {
  //       required: true,
  //       content: {
  //         "application/json": {
  //           schema: {
  //             type: "object",
  //             properties: {
  //               _id: {
  //                 type: "string",
  //                 description: "Course _id",
  //               },
  //               title: {
  //                 type: "string",
  //                 description: "Course title",
  //               },
  //               description: {
  //                 type: "string",
  //                 description: "Course description",
  //               },
  //               price: {
  //                 type: "number",
  //                 description: "Course price",
  //               },
  //               newThumbnail: {
  //                 type: "string",
  //                 format: "binary",
  //                 description: "newThumbnail must be less than 2 MB",
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     responses: {
  //       "200": {
  //         description: "Course created successfully",
  //       },
  //       "400": {
  //         description: "Bad request. Invalid course data provided.",
  //       },
  //       "500": {
  //         description: "Internal server error",
  //       },
  //     },
  //     tags: ["Course"],
  //     security: [{ cookieAuth: [] }],
  //   },
  // },
};
