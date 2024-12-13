import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_TOKEN || "rohith@9866";

export interface AuthenticatedDocRequest extends Request {
  docInfo?: JwtPayload | string;
}

export const verifyDocToken = async (
  req: AuthenticatedDocRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const jwtToken = authHeader.split(" ")[1];

    if (!jwtToken) {
      return res
        .status(401)
        .json({ message: "JWT Token is missing or invalid" });
    }

    const payload = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;

    req.docInfo = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired JWT Token" });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "JWT Token has expired" });
    } else {
      console.error("Error verifying JWT Token:", error);
      return res.status(500).json({
        message: "An error occurred while verifying the JWT Token",
        error,
      });
    }
  }
};
