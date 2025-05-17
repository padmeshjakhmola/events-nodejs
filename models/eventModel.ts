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
  const query = `SELECT * FROM events ORDER BY date ASC`;
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
