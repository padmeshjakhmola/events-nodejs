import { Router } from "express";
import * as AuthController from "../controllers/auth.js";

const router = Router();

router.get("/", AuthController.getCurrentUser);

export default router;
