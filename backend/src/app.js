import { Server } from "socket.io";
import cors from "cors";

import express from "express";
import dotenv from "dotenv";
import { saveMessage } from "./services/chatService.js";
dotenv.config();

const port = process.env.PORT || 5000;

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
