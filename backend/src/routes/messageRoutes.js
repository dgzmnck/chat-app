// src/routes/messageRoutes.js
import express from "express";
import { saveMessage, getMessages } from "../services/messageService.js";

const router = express.Router();

// Save a new message
router.post("/", async (req, res) => {
  const { sender, message } = req.body;
  if (!sender || !message)
    return res.status(400).json({ error: "Missing sender or message" });

  try {
    await saveMessage(sender, message);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get messages with pagination
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const messages = await getMessages(limit, offset);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
