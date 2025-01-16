import { useState } from "react";
import { io } from "socket.io-client";

// // Connect to the WebSocket server
// const socket = io("http://localhost:4000");

export default function NotificationSender() {
  const [message, setMessage] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");

  const sendNotification = () => {
    if (message.trim() && selectedNetwork) {
      // Connect to the WebSocket server
      const anotherVariable = "other variable";
      const socket = io("https://backend-walletmanag.onrender.com");
      socket.emit("sendNotification", { message, selectedNetwork });
      setMessage(""); // Clear input field
      setSelectedNetwork("");
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
      <select
        value={selectedNetwork}
        onChange={(e) => setSelectedNetwork(e.target.value)}
      >
        <option value="">Select Network</option>
        <option value="mainnet">Ethereum</option>
        <option value="sepolia">Sepolia</option>
      </select>
      <br /> <br />
      <button class="button" onClick={sendNotification}>
        Send
      </button>
    </div>
  );
}
