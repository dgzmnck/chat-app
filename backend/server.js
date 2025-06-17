import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";
import messageRoutes from "./src/routes/messageRoutes.js";
import { saveMessage } from "./src/services/messageService.js";
import initDB from "./src/db/initDB.js";
const app = express();
import fs from "fs";
import http from "http";
import https from "https";
const keyPath = path.resolve("./etc/sslcert/nwssu.edu.ph.key");
const certPath = path.resolve("./etc/sslcert/nwssu.edu.ph.cert");
var privateKey = fs.readFileSync("./etc/sslcert/nwssu.edu.ph.key", "utf8");
var certificate = fs.readFileSync("./etc/sslcert/nwssu.edu.ph.pem.crt", "utf8");
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

httpServer.listen(8080, () => {
  console.log("http server runnnig port 3000");
});

httpsServer.listen(8443, () => {
  console.log("https server runnnig port 443");
});
