import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const getCurrentUser = (req: Request, res: Response): any => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "token_missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      fullName: string;
    };

    return res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(403).json({ message: "invalid_or_expired_token" });
  }
};
