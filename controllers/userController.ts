import "dotenv/config";
import z from "zod";
import * as UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

const userSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const parsed = userSchema.parse(req.body);

    const existingUser = await UserModel.getUserByEmail(parsed.email);
    if (existingUser) {
      return res.status(409).json("user_already_exists");
    }

    const newUser = await UserModel.createUser(parsed);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, fullName: newUser.fullname },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("error_registering_user", error);
    res.status(500).json({ message: "internal_server_error" });
  }
};
