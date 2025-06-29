import jwt from "jsonwebtoken";
import multer from "multer";
import cloudinary from "cloudinary";

export const generateJWTToken = (userId: string, userRole: string) => {
  const token = jwt.sign(
    { userId, userRole },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1d",
    }
  );

  return token;
};

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
});

// uploading single image to the cloudinary
export async function uploadImage(file: any) {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = "data:" + file.mimetype + ";base64," + b64;
  const fileUrl = await cloudinary.v2.uploader.upload(dataURI, {
    format: "webp",
  });

  return fileUrl.secure_url;
}
