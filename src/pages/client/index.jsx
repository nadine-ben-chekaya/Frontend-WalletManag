"use client";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

export default function ClientPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [adminmessage, setAdminmsg] = useState("");

  useEffect(() => {
    if (role !== "client") {
      router.push("/"); // Redirect unauthorized users to the home page
    }
    const socket = io("https://backend-walletmanag.onrender.com");
    socket.on("adminNotif", (message) => {
      console.log("message from Admin,", message);
      setAdminmsg(message);
    });
    // Cleanup function to remove the event listener
    return () => {
      socket.off("adminNotif ");
      socket.disconnect();
    };
  }, [role]);

  if (role !== "client") return null; // Prevent rendering if not authorized

  return (
    <div>
      <h1>Hello Client!</h1>
      {/* Predefined button  */}
      <Web3Button icon="show" label="Connect Wallet" balance="show" />
      <br />
      <br />

      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
      <br />
      <br />

      {/* Custom button */}
      <CustomButton />
      {adminmessage}
    </div>
  );
}
