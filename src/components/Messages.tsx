"use client";
import {
  useState,
  useEffect,
  useRef,
  Children,
  ChangeEvent,
  useContext,
} from "react";
import {
  Anonytalk,
  FileIcon,
  LogoutIcon,
  MembersIcon,
  SendIcon,
} from "./Icons";
import Image from "next/image";
import { getFile } from "@/lib/utils";
import DarkMode from "./DarkMode";
import Message from "./Message";
import { IMessage } from "@/lib/types";
import { Socket } from "socket.io-client";
import Context from "@/context";

const Messages = ({ socket }: { socket: Socket }) => {
  const { user, setUser } = useContext(Context);
  const [roomClients, setRoomClients] = useState<number>(0);
  const [files, setFiles] = useState<string[]>([]);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const lastMessage = useRef<HTMLDivElement | null>(null);

  //Handles image conversion to base64
  const handleFiles = async (e: FileList) => {
    if (e) {
      const bucket = [];
      for (let i = 0; i < e.length; i++) {
        bucket.push((await getFile(e[i])) as string);
      }

      setFiles([...files, ...bucket]);
    }

    return null;
  };

  const removeFile = (id: string) => {
    const bucket = files.filter((e) => e !== id);

    setFiles(bucket);
  };

  //Sends a Message with the current user data and time to the socket and set the message into the message list box
  const sendMessage = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputFile = document.querySelector<HTMLInputElement>("#file");
    const message = e.target.message.value;
    if (message.length === 0 && !files.length) {
      return null;
    }

    if (user.nick && user.room && socket.id) {
      const messageData: IMessage = {
        id: socket.id,
        room: user.room.trim(),
        files,
        author: user.nick.trim(),
        color: user.color,
        message: message.trim() || "",
        time: new Date(),
      };

      socket.emit("send_message", messageData);
      setMessageList((prev) => [...prev, messageData]);
      setFiles([]);
      e.target.message.value = "";

      if (inputFile) {
        inputFile.value = "";
      }

      return null;
    } else {
      location.reload();
    }

    return false;
  };

  const leaveRoom = () => {
    socket.emit("leave_room", { nick: user.nick, room: user.room });
    location.reload();
  };

  //Scroll to bottom every time someone sends a message
  useEffect(() => {
    if (lastMessage?.current) {
      lastMessage.current.scrollTop = lastMessage.current.scrollHeight;
    }
  }, [messageList]);

  //Gets Data every time socket emit a signal
  useEffect(() => {
    socket.on("receive_message", (data: IMessage) => {
      setMessageList((list) => [...list, data]);
      console.log(messageList);
    });

    socket.on("room_clients", (data: any) => {
      setRoomClients(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_clients");
    };
  }, [messageList, socket]);

  return (
    <section className="flex flex-col h-full reveal max-w-screen-2xl w-[95%] mx-auto">
      <nav className="flex items-center justify-between py-3">
        <a
          href="/"
          onClick={leaveRoom}
          className="nav-items">
          <Anonytalk size={"1.5em"} />
          <span className="max-md:hidden truncate max-w-xs leading-none">
            {user.room}
          </span>
        </a>

        <div className="flex gap-1.5 items-center text-sm">
          <div className="nav-items">
            <input
              defaultValue={user.color}
              onChange={(e) =>
                setUser({
                  ...user,
                  color: e.target.value,
                  colorIcon: e.target.value,
                })
              }
              id="color"
              type="color"
              className="h-3.5 w-3.5 rounded-full overflow-hidden cursor-pointer border"
            />
          </div>
          <DarkMode className="max-md:hidden" />

          <div className="nav-items">
            <MembersIcon />
            <span className="leading-none">{roomClients}</span>
          </div>

          <button
            type="button"
            onClick={leaveRoom}
            className="nav-items press hover:bg-red-500 transition duration-150 hover:text-white">
            <LogoutIcon />
            <span className="leading-none">Salir</span>
          </button>
        </div>
      </nav>

      <section
        className="flex flex-col flex-1 gap-2 py-4 h-[90dvh] overflow-y-scroll scroll-smooth relative px-3"
        ref={lastMessage}>
        {Children.toArray(
          messageList.map((userMessage: IMessage) => (
            <Message
              data={{
                ...userMessage,
                socket: socket.id || "",
              }}
            />
          )),
        )}
      </section>

      <section className="flex items-center gap-4 w-full mx-auto pb-2">
        {files?.length > 0 ? (
          <>
            {files.map((file: string, index: number) => (
              <div
                className="relative block w-fit"
                key={index}>
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="absolute -top-4 -right-3 text-sm bg-white text-black px-1.5 pt-0.5 block border border-[#27e099] rounded-full">
                  X
                </button>
                {file.startsWith("data:image") ? (
                  <Image
                    width={100}
                    height={100}
                    className="object-contain w-auto h-auto max-w-[60px] max-h-[60px] block"
                    src={file}
                    alt="anonymous image"
                    unoptimized
                    priority
                  />
                ) : file.startsWith("data:application/pdf") ? (
                  <p
                    className="bg-gradient-to-t from-red-500 to-red-600 cursor-pointer py-1.5 px-3 rounded-xl text-white"
                    id={file}>
                    PDF
                  </p>
                ) : (
                  <p
                    className="bg-gradient-to-t from-blue-600 to-blue-500 cursor-pointer py-1.5 px-3 rounded-xl text-white"
                    id={file}>
                    Archivo
                  </p>
                )}
              </div>
            ))}
          </>
        ) : null}
      </section>

      <form
        onSubmit={(e: ChangeEvent<HTMLFormElement>) => sendMessage(e)}
        className="border overflow-hidden rounded-lg w-full mx-auto mb-5 input">
        <textarea
          className="bg-transparent w-full resize-none outline-none p-3 border-none h-20"
          name="message"
          placeholder="Aa"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              document.querySelector<HTMLButtonElement>("#send")?.click();
            }
          }}
        />
        <div className="flex justify-between items-center px-3 pb-3">
          <label
            htmlFor="file"
            className="flex items-center dark:bg-white/10 p-2.5 rounded-lg cursor-pointer hover:bg-black/5 transition duration-200 press">
            <FileIcon className="fill-current" />
            <input
              id="file"
              multiple
              type="file"
              className="hidden"
              onChange={(e) => {
                e.target.files ? handleFiles(e.target.files) : null;
              }}
            />
          </label>
          <button
            id="send"
            className="text-white dark:text-black bg-black dark:bg-white py-2 px-3 rounded-lg press text-sm inline-flex gap-1.5 items-center"
            type="submit">
            Enviar Mensaje
            <SendIcon />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Messages;
