import { Request, Response } from "express";
import * as EventModel from "../models/eventModel.js";

export async function getAttendees(req: Request, res: Response): Promise<any> {
  try {
    const { eventId } = req.params;

    const attendees = await EventModel.getEventAttendees(eventId);

    res.status(200).json(attendees);
  } catch (error) {
    console.error("Error getting attendees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
