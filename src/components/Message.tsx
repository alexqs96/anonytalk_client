"use client";
import { useState, useEffect, useRef, FormEvent, Children } from "react";
import Linkify from "react-linkify";
import { Socket } from "socket.io-client";
import { Anonytalk, ImageFile } from "./Icons";
import Image from "next/image";
import { getImageFile } from "@/lib/utils";

interface MessageInterface {
  id: string;
  room: string;
  images: string[];
  author: string;
  message: string;
  time: string;
}

const Message = ({
  socket,
  nick,
  room,
}: {
  socket: Socket;
  nick: string;
  room: string;
}) => {
  const [roomClients, setRoomClients] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [messageList, setMessageList] = useState<MessageInterface[]>([]);
  const lastMessage = useRef<HTMLParagraphElement>(null);

  //Handles image conversion to base64
  const handleImages = async (e: any) => {
    if (e) {
      const bucket = [];
      for (let i = 0; i < e.length; i++) {
        bucket.push((await getImageFile(e[i])) as string);
      }

      setImages([...images, ...bucket]);
    }
    return null;
  };

  const removeImage = (id: string) => {
    const bucket = images.filter((e) => e !== id);

    setImages(bucket);
  };

  //Sends a Message with the current user data and time to the socket and set the message into the message list box
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!messageRef?.current?.value) {
      return null;
    }

    if (messageRef.current.value && nick && room) {
      const messageData: MessageInterface = {
        id: socket.id,
        room: room,
        images,
        author: nick,
        message: messageRef?.current?.value,
        time: new Date().toLocaleTimeString("es-ES", {
          hour: "numeric",
          minute: "numeric",
        }),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setImages([]);
      messageRef.current.value = "";
    } else {
      location.reload();
    }
  };

  const leaveRoom = () => {
    socket.emit("leave_room", { nick, room });
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
    socket.on("receive_message", (data: MessageInterface) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("room_clients", (data) => {
      setRoomClients(data);
    });
  }, [socket]);

  return (
    <section className="flex flex-col h-full reveal">
      <nav className="flex items-center justify-between bg-gradient-to-b from-white to-transparent dark:bg-gradient-to-b dark:from-slate-800 dark:to-transparent py-2 px-[3%] sm:px-[1%] blurify">
        <a href="/" onClick={leaveRoom}>
          <Anonytalk size={64} styles={null} />
        </a>

        <div className="flex gap-3 items-center">
          <p>Clientes: {roomClients}</p>|
          <button
            type="button"
            onClick={leaveRoom}
            className="border dark:border-white/30 dark:bg-slate-800 px-4 py-1 rounded"
          >
            Salir
          </button>
        </div>
      </nav>

      <section
        className="flex flex-col flex-1 gap-4 py-4 px-[3%] sm:px-[1%] h-[90dvh] overflow-y-scroll scroll-smooth"
        ref={lastMessage}
      >
        {Children.toArray(
          messageList.map((userMessage) => {
            return (
              <>
                {userMessage.images.length > 0 ? (
                  <div
                    className={
                      "flex items-center gap-2 flex-col -mb-1 " +
                      (socket.id !== userMessage.id ? "ml-auto" : "mr-auto")
                    }
                  >
                    {userMessage.images.map((image: string, index: number) => (
                      <Image
                        key={index}
                        width={200}
                        height={200}
                        className={
                          "object-contain w-auto h-auto max-w-[100px] max-h-[100px] rounded-lg block mb-1 " +
                          (socket.id !== userMessage.id
                            ? "ml-auto rounded-br-none"
                            : "mr-auto rounded-bl-none")
                        }
                        src={image}
                        alt="anonymous image"
                        unoptimized
                        priority
                      />
                    ))}
                  </div>
                ) : null}
                <div
                  className={
                    "w-fit py-2 px-3 rounded-2xl " +
                    (userMessage.author === ""
                      ? "bg-black dark:bg-slate-700 text-white mx-auto"
                      : socket.id === userMessage.id
                      ? "bg-[#27e099] dark:bg-[#00c076] text-white rounded-bl-none"
                      : socket.id !== userMessage.id
                      ? "bg-[#2889ff] text-white rounded-br-none ml-auto"
                      : "bg-[#2889ff] text-white rounded-br-none ml-auto")
                  }
                >
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        target="blank"
                        rel="noreferrer noopener"
                        href={decoratedHref}
                        key={key}
                        className="font-medium underline"
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    <small>
                      {userMessage.author === ""
                        ? ""
                        : "@" + userMessage.author}
                    </small>
                    <p>{userMessage.message}</p>
                    <small className="ml-auto w-fit block">
                      {userMessage.time}
                    </small>
                  </Linkify>
                </div>
              </>
            );
          }),
        )}
      </section>
      <section className="flex items-center gap-4 max-w-[94%] sm:max-w-[98%] w-full mx-auto pb-2">
        {images.length > 0 ? (
          <>
            {images.map((image: string, index: number) => (
              <div className="relative block w-fit" key={index}>
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className="absolute -top-4 -right-3 text-sm bg-white text-black px-1.5 pt-0.5 block border border-[#27e099] rounded-full"
                >
                  X
                </button>
                <Image
                  width={100}
                  height={100}
                  className="object-contain w-auto h-auto max-w-[60px] max-h-[60px] block"
                  src={image}
                  alt="anonymous image"
                  unoptimized
                  priority
                />
              </div>
            ))}
          </>
        ) : null}
      </section>
      <section className="flex dark:bg-slate-800 border dark:border-white/5 overflow-hidden focus-within:border-[#27e099] dark:focus-within:border-[#27e099] rounded-lg max-w-[94%] sm:max-w-[98%] w-full mx-auto mb-3">
        <label
          htmlFor="file"
          className="flex items-center bg-white dark:bg-slate-800 px-3 cursor-pointer"
        >
          <ImageFile />
          <input
            id="file"
            multiple
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              e.target.files ? handleImages(e.target.files) : null;
            }}
          />
        </label>
        <textarea
          className="w-full py-1 resize-none outline-none dark:bg-white/10 indent-2 rounded-none border-l dark:border-white/5 min-h-[3.5em]"
          ref={messageRef}
          placeholder="Aa"
          onKeyDown={(e) => {
            e.key === "Enter" && !e.shiftKey && sendMessage(e);
          }}
        />
        <button className="text-white px-3 bg-[#27e099]" onClick={sendMessage}>
          Enviar
        </button>
      </section>
    </section>
  );
};

export default Message;
