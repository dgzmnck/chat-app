import * as chatService from "../services/chatService.js";

export const getChatHistory = async (req, res) => {
  try {
    const messages = await chatService.getMessages();
    res.json(messages);
  } catch (err) {
    console.error("Controller: getChatHistory →", err);
    res.status(err.statusCode || 500).send(err.message || "Chat history error");
  }
};
