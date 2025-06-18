import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


// const socket = io(API_URL);

// const socket = io("https://apichat.nwssu.edu.ph", { transports: ["websocket"] });


const socket = io(API_URL, {
    transports: ["websocket"]
});


const Chat = () => {
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Load messages on initial render
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(API_URL, { params: { limit: 50, offset: 0 } });
        console.log("Raw API response:", res.data);

        setMessages(res.data.reverse());
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();
  }, []);

  // Listen for new incoming messages in real-time
  useEffect(() => {
    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("chat-message");
  }, []);

  // Scroll to bottom on message change
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [messages]);

  const sendMessage = async () => {
    if (!sender.trim() || !message.trim()) return;

    socket.emit("chat-message", { sender, message });
    setMessage(""); // reset input
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className=" w-full max-w-md bg-white rounded shadow p-4 space-y-4">
        <h1 className="text-xl font-bold text-blue-600 text-center">💬 Real-Time Chat</h1>

        <input
          type="text"
          placeholder="Your name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
        />

        <div className="h-64 overflow-y-auto bg-gray-50 border rounded p-2 text-sm">
          {messages.map((m, i) => (
            <div key={i} className="mb-1">
              <span className="font-semibold text-blue-700">{m.sender}:</span> {m.message}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-3 py-2 border rounded text-sm"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;