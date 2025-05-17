import { Request, Response } from "express";
import * as UserModel from "../models/userModel.js";
import * as EventModel from "../models/eventModel.js";
import z from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: "Invalid date format",
  }),
  location: z.string().optional(),
  owner_email: z.string().email().optional(),
});

export async function getEvents(req: Request, res: Response) {
  try {
    const events = await EventModel.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error("error_getting_event", error);
  }
}

export async function createEvent(req: Request, res: Response): Promise<any> {
  try {
    const parsed = eventSchema.parse(req.body);

    let ownerId;

    if (parsed.owner_email) {
      const user = await UserModel.getUserByEmail(parsed.owner_email);
      if (!user) {
        return res.status(404).json({ message: "user_not_exists" });
      }
      ownerId = user.id!;
    }

    const event = await EventModel.createEvent({
      name: parsed.name,
      description: parsed.description,
      date: parsed.date,
      location: parsed.location,
      owner: ownerId!,
    });

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("error_creating_event", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteEvent(req: Request, res: Response): Promise<any> {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "event_id_required" });
  }

  try {
    const deleted = await EventModel.deleteEvent(id);
    if (!deleted) {
      return res.status(404).json({ message: "event_not_found" });
    }

    res.status(200).json({ message: "event_deleted_successfully" });
  } catch (error) {
    console.error("error_deleting_event", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
