// src/services/messageService.js
import db from "../db/db.js";

export const saveMessage = async (sender, message) => {
  await db.query("INSERT INTO messages (sender, message) VALUES ($1, $2)", [
    sender,
    message,
  ]);
};

export const getMessages = async (limit, offset) => {
  const result = await db.query(
    "SELECT sender, message, sent_at FROM messages ORDER BY sent_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return result.rows;
};
