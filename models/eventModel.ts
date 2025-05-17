import { pool } from "../db";

export interface Event {
  id: number;
  name: string;
  description?: string;
  date: string;
  location?: string;
  owner?: string;
}

export async function getAllEvents() {
  const query = `
    SELECT 
      e.id,
      e.name,
      e.description,
      e.date,
      e.location,
      e.owner,
      u.fullname AS owner_name
    FROM events e
    LEFT JOIN users u ON e.owner = u.id
    ORDER BY e.date ASC
  `;
  const result = await pool.query(query);

  return result.rows;
}

export async function createEvent(event: Omit<Event, "id">): Promise<Event> {
  const { name, description, date, location, owner } = event;

  const query = `INSERT INTO events (name, description, date, location, owner) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  const values = [
    name,
    description || null,
    date,
    location || null,
    owner || null,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

// attending_event

export async function attendEvent(event_id: string, user_id: string) {
  const query = `
    INSERT INTO event_attendees (event_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (event_id, user_id) DO NOTHING
    RETURNING *`;

  const result = await pool.query(query, [event_id, user_id]);
  return result.rows[0];
}

export async function getEventAttendees(event_id: string) {
  const query = `
    SELECT users.id, users.fullname, users.email, ea.is_cancelled, ea.cancellation_reason
    FROM event_attendees ea
    JOIN users ON ea.user_id = users.id
    WHERE ea.event_id = $1`;

  const result = await pool.query(query, [event_id]);
  return result.rows;
}

export async function cancelAttendance(
  event_id: string,
  user_id: string,
  reason: string
) {
  const query = `
    UPDATE event_attendees
    SET is_cancelled = true, cancellation_reason = $3
    WHERE event_id = $1 AND user_id = $2
    RETURNING *`;

  const result = await pool.query(query, [event_id, user_id, reason]);
  return result.rows[0];
}
