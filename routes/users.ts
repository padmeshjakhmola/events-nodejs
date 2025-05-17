import { Router } from "express";
import * as UserController from "../controllers/userController.js";

const router = Router();

// router.get("/", UserController.getEvents);
router.post("/create", UserController.registerUser);

export default router;
