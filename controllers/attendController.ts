import { Request, Response } from "express";
import * as EventModel from "../models/eventModel.js";

export async function attendEvent(req: Request, res: Response): Promise<any> {
  try {
    const { eventId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "userid_required" });
    }

    const attendance = await EventModel.attendEvent(eventId, user_id);

    if (!attendance) {
      return res.status(200).json({ message: "already_attending_or_error" });
    }

    res.status(201).json({ message: "event_attended_successfully", attendance });
  } catch (error) {
    console.error("error_attending_event:", error);
    res.status(500).json({ message: "internal_server_error" });
  }
}
