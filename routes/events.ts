import { Router } from "express";
import * as EventController from "../controllers/eventsController.js";
import * as AttendEvent from "../controllers/attendController.js";
import * as AttendeesController from "../controllers/attendeesController.js";
import * as CancleController from "../controllers/cancleController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", EventController.getEvents);
router.post("/create", EventController.createEvent);

router.post("/:eventId/attend", AttendEvent.attendEvent);
router.get("/:eventId/attendees", AttendeesController.getAttendees);
router.post("/:eventId/cancle", CancleController.cancelAttendee);
router.delete("/:id", EventController.deleteEvent);

export default router;
