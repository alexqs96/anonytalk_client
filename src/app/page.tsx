"use client";
import { useContext } from "react";
import Messages from "@/components/Messages";
import Login from "@/components/Login";
import { connect as io } from "socket.io-client";
import Context from "@/context";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default function Home() {
  const { user } = useContext(Context);

  return (
    <>
      {user.nick.length > 0 && user.room.length > 0 ? (
        <Messages socket={socket} />
      ) : (
        <Login socket={socket} />
      )}
    </>
  );
}
