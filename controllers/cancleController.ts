import { Request, Response } from "express";
import * as UserModel from "../models/userModel.js";
import * as EventModel from "../models/eventModel.js";

export async function cancelAttendee(req: Request, res: Response): Promise<any> {
  const { eventId } = req.params;
  const { user_id, reason } = req.body;

  const cancelled = await EventModel.cancelAttendance(
    eventId,
    user_id,
    reason
  );

  if (!cancelled) {
    return res
      .status(404)
      .json({ message: "not_found_or_cancelled" });
  }

  res.status(200).json({ message: "attendee_cancelled", cancelled });
}
