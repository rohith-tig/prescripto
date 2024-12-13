import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_TOKEN || "rohith@9866";

export interface AuthenticatedAdminRequest extends Request {
  adminInfo?: string | JwtPayload;
}

export const verifyAdminToken = async (
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const jwtToken = authHeader.split(" ")[1];
  console.log(jwtToken);

  if (!jwtToken) {
    return res.status(401).json({ message: "Invalid JWT Token" });
  }

  try {
    const payload = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;

    req.adminInfo = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid JWT Token", error });
  }
};
