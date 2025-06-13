import { Router } from "express";
import * as chatController from "../controllers/chatController.js";

const router = Router();

router.get("/history", chatController.getChatHistory);

export default router;
