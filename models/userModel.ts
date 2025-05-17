import { pool } from "../db";
import bcrypt from "bcryptjs";

export type User = {
  id?: string;
  fullname: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
};

const SALT_ROUNDS = 10;

export async function getAllUsers() {
  const query = `SELECT * FROM users ORDER ORDER BY created_at DESC`;
  const result = await pool.query(query);

  return result.rows;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function createUser(user: User) {
  const hashedPassword = await bcrypt.hash(user.password!, SALT_ROUNDS);

  const query = `
    INSERT INTO users (fullname, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, fullname, email, created_at
  `;

  const values = [user.fullname, user.email, hashedPassword];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function signInUser(email: string, password: string): Promise<User | null | "invalid_password"> {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (result.rows.length === 0) {
    return null; 
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return "invalid_password";
  }

// avoiding_memory_leaks
  delete user.password;
  return user;
}
