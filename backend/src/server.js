import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { Server } from "socket.io";
import cors from "cors";

import messageRoutes from "./routes/messageRoutes.js";
import { saveMessage } from "./services/messageService.js";
import initDB from "./db/initDB.js";

const app = express();

console.log("DB_PASSWORD type:", typeof process.env.PG_PASSWORD);
// SSL
import fs from "fs";
import http from "http";
import https from "https";
var privateKey = fs.readFileSync("/sslcert/nwssu.edu.ph.key", "utf8");
var certificate = fs.readFileSync("/sslcert/nwssu.edu.ph.pem.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

const io = new Server(httpsServer, {
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

httpServer.listen(3000, () => {
  console.log("http server runnnig port 3000");
});

httpsServer.listen(443, () => {
  console.log("https server runnnig port 443");
});
