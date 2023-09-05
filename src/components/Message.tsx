"use client";
import { useState, useEffect, useRef, FormEvent, Children } from "react";
import Linkify from "react-linkify";
import { Socket } from "socket.io-client";
import { Anonytalk, FileIcon, MembersIcon, SendIcon } from "./Icons";
import Image from "next/image";
import { generateUniqueCode, getFile } from "@/lib/utils";
import { DarkMode } from "./DarkMode";

interface MessageInterface {
  id: string;
  room: string;
  images: string[];
  author: string;
  color: string;
  message: string;
  time: string;
}

const Message = ({
  socket,
  nick,
  room,
  color,
}: {
  socket: Socket;
  nick: string;
  room: string;
  color: string;
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
        bucket.push((await getFile(e[i])) as string);
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
    if (!messageRef?.current?.value && !images.length) {
      return null;
    }

    if (nick && room) {
      const messageData: MessageInterface = {
        id: socket.id,
        room: room.trim(),
        images,
        author: nick.trim(),
        color,
        message: (messageRef?.current?.value)?.trim() || "",
        time: new Date().toLocaleTimeString("es-ES", {
          hour: "numeric",
          minute: "numeric",
        }),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setImages([]);
      messageRef?.current?.value? messageRef.current.value = "" : null
    } else {
      location.reload();
    }
  };

  const leaveRoom = () => {
    socket.emit("leave_room", { nick, room });
    location.reload();
  };

  const openFileTab = (data64file: string) => {
    const newTab = window.open();
    newTab?.document.write(
        `<!DOCTYPE html><head><title>Anonytalk Documento</title></head><body><iframe style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" src="${data64file}"></body></html>`);
    newTab?.document.close();
  }

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
      <nav className="max-w-[99%] mx-auto w-full flex items-center justify-between bg-gradient-to-b from-white to-transparent dark:bg-gradient-to-b dark:from-slate-800 dark:to-transparent py-2 lg:py-3 px-[3%] sm:px-[1.25%] blurify lg:rounded-xl lg:mt-2 overflow-hidden">
        <a href="/" onClick={leaveRoom} className="flex items-center gap-3">
          <Anonytalk size={42} styles={null} />
          <p className="max-md:hidden text-xl truncate max-w-xs">{room}</p>
        </a>

        <div className="flex gap-2 items-center max-sm:text-sm">
          <div className="max-md:hidden">
            <DarkMode />
          </div>
          <div className="flex items-center py-1.5 px-3 bg-white dark:bg-slate-700 shadow rounded-xl border border-black/5 dark:border-white/5">
            <MembersIcon />: {roomClients}
          </div>
          <button
            type="button"
            onClick={leaveRoom}
            className="py-1.5 px-3 bg-white dark:bg-slate-700 shadow rounded-xl hover:bg-red-500 hover:text-white dark:hover:bg-red-500/50 border border-black/5 dark:border-white/5 pressable"
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
                      "flex gap-5 flex-col -mb-1 " +
                      (socket.id !== userMessage.id ? "ml-auto items-end" : "mr-auto items-start")
                    }
                  >
                    {
                      Children.toArray(
                      userMessage.images.map((image: string) => (
                      <div className="flex flex-col gap-2">
                      <p style={{backgroundColor: userMessage.color}} className={"w-fit py-0.5 px-2 rounded-xl text-shadow -mb-1 "+(socket.id === userMessage.id
                        ? " text-white mr-auto"
                        : " text-white ml-auto")}>@{userMessage.author} ~ <small>{userMessage.time}</small></p>
                      {
                        image.startsWith("data:image")?
                        <Image
                          onClick={() => openFileTab(image)}
                          width={200}
                          height={200}
                          className={
                            "object-contain cursor-pointer w-full h-full max-w-[128px] md:max-w-[256px] max-h-[128px] md:max-h-[256px] rounded-lg block mb-1 " +
                            (socket.id !== userMessage.id
                              ? "ml-auto rounded-br-none"
                              : "mr-auto rounded-bl-none")
                          }
                          src={image}
                          alt="anonymous image"
                          unoptimized
                          priority
                        />
                        :
                        image.startsWith("data:application/pdf")?
                        <div className="flex items-center gap-2">
                        <p
                          className="bg-gradient-to-t from-red-500 to-red-600 cursor-pointer py-1.5 px-3 rounded-md text-white"
                          onClick={() => openFileTab(image)}
                        >Ver PDF de @{userMessage.author}</p>
                        <a href={image} className="w-fit bg-gradient-to-t from-blue-600 to-blue-500 cursor-pointer py-1.5 px-3 rounded-md text-white" download={userMessage.author+ "_archivo_"+generateUniqueCode()}>
                          Descargar PDF
                        </a>
                        </div>
                        :
                        <a href={image} className="w-fit bg-gradient-to-t from-blue-600 to-blue-500 cursor-pointer py-1.5 px-3 rounded-md text-white" download={userMessage.author+ "_archivo_"+generateUniqueCode()}>
                          Descargar Archivo de @{userMessage.author}
                        </a>
                      }
                      </div>
                    )))}
                  </div>
                ) : null}
                {
                  userMessage.message?
                  <div
                    style={{backgroundColor: userMessage.color}}
                    className={
                      "w-fit py-2 px-3.5 rounded-2xl text-shadow " +
                      (userMessage.author === ""
                        ? " text-white mx-auto"
                        : socket.id === userMessage.id
                        ? " text-white rounded-bl-none "
                        : socket.id !== userMessage.id
                        ? " text-white rounded-br-none ml-auto"
                        : " text-white rounded-br-none ml-auto")
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
                      <small className="-mb-0.5 block">
                        {userMessage.author === ""
                          ? ""
                          : "@" + userMessage.author}
                      </small>
                      <p className="whitespace-break-spaces">{userMessage.message}</p>
                      <small className="text-[0.7em] ml-auto -mb-0.5 mt-0.5 w-fit block">
                        {userMessage.time}
                      </small>
                    </Linkify>
                  </div>
                  :
                  null
                }
              </>
            );
          }),
        )}
      </section>
      <section className="flex items-center gap-4 max-w-[99%] w-full mx-auto pb-2">
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
                {
                  image.startsWith("data:image")?
                  <Image
                    width={100}
                    height={100}
                    className="object-contain w-auto h-auto max-w-[60px] max-h-[60px] block"
                    src={image}
                    alt="anonymous image"
                    unoptimized
                    priority
                  />
                  : image.startsWith("data:application/pdf")?
                  <p className="bg-gradient-to-t from-red-500 to-red-600 cursor-pointer py-1.5 px-3 rounded-xl text-white" id={image}>PDF</p>
                  :
                  <p className="bg-gradient-to-t from-blue-600 to-blue-500 cursor-pointer py-1.5 px-3 rounded-xl text-white" id={image}>Archivo</p>
                }
              </div>
            ))}
          </>
        ) : null}
      </section>
      <section className="flex bg-[#f8f8f8] dark:bg-slate-800 border dark:border-white/5 overflow-hidden focus-within:border-black/20 dark:focus-within:border-white/20 rounded-xl max-w-[99%] w-full mx-auto mb-3">
        <textarea
          className="bg-transparent w-full resize-none outline-none dark:bg-white/10 py-2 pl-3.5 rounded-none border-l dark:border-white/5 min-h-[3.5em] lg:min-h-[4.5em]"
          ref={messageRef}
          placeholder="Aa"
          onKeyDown={(e) => {
            e.key === "Enter" && !e.shiftKey && sendMessage(e);
          }}
        />
        <label
          htmlFor="file"
          className="flex items-center dark:bg-white/10 px-5 cursor-pointer"
        >
          <FileIcon />
          <input
            id="file"
            multiple
            type="file"
            className="hidden"
            onChange={(e) => {
              e.target.files ? handleImages(e.target.files) : null;
            }}
          />
        </label>
        <button
          className="text-white px-4 md:px-5 lg:px-6 anonytalk md:text-lg"
          onClick={sendMessage}
        >
          <SendIcon />
        </button>
      </section>
    </section>
  );
};

export default Message;
