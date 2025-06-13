import db from "../db/db.js";
import { AppError } from "../utils/AppError.js";

export const saveMessage = async (user, message) => {
  try {
    const result = await db.query(
      "INSERT INTO messages (sender, message) VALUES ($1, $2) RETURNING *",
      [user, message]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Service: saveMessage →", err);
    throw new AppError("Failed to save message to DB", 500);
  }
};

export const getMessages = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM messages ORDER BY sent_at ASC"
    );
    return result.rows;
  } catch (err) {
    console.error("Service: getMessages →", err);
    throw new AppError("Failed to retrieve chat history", 500);
  }
};
