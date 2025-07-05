# 📚 Course Pilot LMS - Backend

> ⚠️ This project was developed as part of an assignment task.

A Node.js + TypeScript-based backend server for a Learning Management System (LMS) called **Course Pilot**. Built following the **MVC architecture** and powered by **Express**, **MongoDB**, and **Cloudinary** for file uploads.

---

## 🌐 Live API & Documentation

- **📡 API Base URL**: [`https://course-pilot-backend.vercel.app`](https://course-pilot-backend.vercel.app)
- **📖 Swagger Docs**: [`https://course-pilot-backend.vercel.app/docs`](https://course-pilot-backend.vercel.app/docs)

> /docs might not work on production. Because vercel doesn't allow it, it has to be configured. You can try on localhost.

### 📸 Swagger Screenshot

![Swagger Screenshot](./src/assets/api.png)

> Replace this screenshot path with your actual image location.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB (with Mongoose)**
- **Cloudinary** – File uploads (PDFs, thumbnails)
- **JWT** – Authentication
- **Bcrypt** – To hash password
- **Multer** – File handling
- **Express-Validator** – Input validation
- **Cookie-parser** – Secure session cookies
- **CORS** – Cross-origin handling

---

## 📁 Project Structure (MVC)

```
├── src/
│   ├── controllers/   # Request handlers (business logic)
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express route definitions
│   ├── middlewares/   # Auth, validation, error handling
│   ├── lib/           # Contains util functions
│   ├── types/         # Contains data type
│   └── index.ts       # Entry point
├── dist/              # Compiled JS output (after build)
├── vercel.json        # Vercel deployment config
└── package.json       # Project metadata and scripts
```

---

## 🔧 Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start dev server using nodemon   |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Start the server from `dist`     |

---

## 🌐 API & Deployment

- Hosted on **Vercel** using `@vercel/node`.
- The `vercel.json` routes all requests to `src/index.ts`.

### ✅ Vercel Build Settings:

- **Build Command:** (Leave empty)
- **Output Directory:** (Leave empty)
- **Framework Preset:** Other

---

## 📦 Dependencies

```json
"dependencies": {
  "bcrypt": "^6.0.0",
  "cloudinary": "^2.7.0",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^17.0.0",
  "express": "^5.1.0",
  "express-validator": "^7.2.1",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.16.1",
  "multer": "^2.0.1"
}
```

---

## 🛠 Dev Dependencies

```json
"devDependencies": {
  "@types/bcrypt": "^5.0.2",
  "@types/cookie-parser": "^1.4.9",
  "@types/cors": "^2.8.19",
  "@types/express": "^4.17.21",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/multer": "^2.0.0",
  "@types/node": "^24.0.6",
  "ts-node": "^10.9.2",
  "typescript": "^5.8.3"
}
```

---

## 📁 Environment Variables

Create a `.env` file at the root with the following:

```
BASE_CLIENT=http://localhost:3000
MONGODB_URI = "mongodb+srv://cp-lms:IbngEEHxRdh42YUr@cluster0.hbiibcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "course-pilot-lms"
JWT_SECRET_KEY=ULKBO57%^&sll%78Jsadf-
CLOUDINARY_CLOUD_NAME=dvsc5qwql
CLOUDINARY_API_KEY=263744275287345
CLOUDINARY_SECRET_KEY=qsxhzJqCHW_l0PuiNJXblXbZZug
```

---

## 📤 Uploads

File uploads are supported via **Multer** and sent to **Cloudinary**:

- PDFs (`uploadPDF`)
- Course thumbnails

---

## 📄 License

This project is part of a student assignment and not intended for production use.
