import jwt from "jsonwebtoken";

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