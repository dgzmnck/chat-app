import db from "../db/db.js";
import { AppError } from "../utils/AppError.js";

export const getAllUsers = async () => {
  try {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
  } catch (err) {
    console.error("Service: getAllUsers →", err);
    throw new AppError("Failed to retrieve users");
  }
};

export const createUser = async (name, email) => {
  try {
    const result = await db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Service: createUser →", err);
    throw new AppError("Failed to create user", 400);
  }
};

export const updateUser = async (id, name, email) => {
  try {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    if (result.rows.length === 0) {
      throw new AppError("User not found", 404);
    }
    return result.rows[0];
  } catch (err) {
    console.error("Service: updateUser →", err);
    throw new AppError(err.message || "Failed to update user", 400);
  }
};

export const deleteUser = async (id) => {
  try {
    const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      throw new AppError("User not found", 404);
    }
  } catch (err) {
    console.error("Service: deleteUser →", err);
    throw new AppError(err.message || "Failed to delete user", 400);
  }
};
