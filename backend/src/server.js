import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import messageRoutes from "./routes/messageRoutes.js";
import { saveMessage } from "./services/messageService.js";
import initDB from "./db/initDB.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

await initDB();

app.use(cors());
app.use(express.json());
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("🔌 User connected");

  socket.on("chat-message", async ({ sender, message }) => {
    try {
      await saveMessage(sender, message);
      io.emit("chat-message", { sender, message, sent_at: new Date() });
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❎ User disconnected");
  });
});

server.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
