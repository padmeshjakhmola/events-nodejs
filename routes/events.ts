import { Router } from "express";
import * as EventController from "../controllers/eventsController.js";

const router = Router();

router.get("/", EventController.getEvents);
router.post("/create", EventController.createEvent);


export default router;
