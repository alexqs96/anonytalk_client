"use client";
import { FormEvent, useRef, useState } from "react";
import * as io from "socket.io-client";
import Message from "@/components/Message";
import { Anonytalk } from "@/components/Icons";
import { DarkMode } from "@/components/DarkMode";
import Social from "@/components/Social";
import { generateNickColor } from "@/lib/utils";

const socket = io.connect(process.env.NEXT_PUBLIC_SERVER_URL as string, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default function Home() {
  const nickRef = useRef<HTMLInputElement>(null);
  const roomRef = useRef<HTMLInputElement>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [color, setColor] = useState<string>(generateNickColor());

  const focusNextInput = () => {
    const active = document.activeElement;
    if (active?.nextElementSibling) {
      (active.nextElementSibling as HTMLElement).focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nickInput = document.querySelector("#nick");
    const roomInput = document.querySelector("#room");

    if (!nickRef.current?.value && !roomRef.current?.value) {
      nickInput?.classList.add("border-red-500");
      roomInput?.classList.add("border-red-500");
    }

    if (!nickRef.current?.value) {
      return nickInput?.classList.add("border-red-500");
    } else {
      nickInput?.classList.remove("border-red-500");
    }

    if (!roomRef.current?.value) {
      return roomInput?.classList.add("border-red-500");
    } else {
      roomInput?.classList.remove("border-red-500");
    }
    socket.emit("join_room", [nickRef.current?.value, roomRef.current?.value]);
    setLoggedIn(true);
  };

  return (
    <>
      {!loggedIn ? (
        <section className="flex justify-center max-lg:my-10 lg:justify-between items-center max-w-screen-xl m-auto h-full md:gap-16 max-md:flex-col-reverse w-[85%] reveal">
          <div className="flex flex-col gap-5 justify-center place-items-center w-full max-w-sm max-lg:pb-20">
            <div className="flex flex-col gap-2 w-fit">
              <h1 className="text-5xl md:text-7xl opacity-90 w-full">
                Anonytalk
              </h1>
              <h2 className="md:text-xl opacity-90 w-fit ml-auto">
                {"Chatea Anonimamente : )"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full p-8 rounded-2xl shadow-xl bg-white dark:bg-slate-800 text-lg sm:text-2xl border border-black/[2%] dark:border-white/5"
            >
              <label
                className="opacity-75 text-xl indent-1 flex items-center gap-2"
                htmlFor="nick"
              >
                Nick
                <button
                  type="button"
                  onClick={() =>
                    document.querySelector<HTMLInputElement>("#color")?.click()
                  }
                  className="text-[.6em] -tracking-wider flex items-center gap-1"
                >
                  ( cambiar color )
                  <input
                    defaultValue={color}
                    onChange={(e) => setColor(e.target.value)}
                    id="color"
                    type="color"
                    className="h-3 w-3 rounded-full overflow-hidden cursor-pointer border"
                  />
                </button>
              </label>
              <input
                ref={nickRef}
                id="nick"
                type="text"
                name="nick"
                placeholder="John"
                className="w-full border rounded-lg p-2 indent-1 mb-4 focus-within:border-[#75fac8] dark:focus-within:border-[#75fac8] dark:bg-white/10 dark:border-white/5 outline-none transition-colors duration-200 shadow"
                onBlur={(e) =>
                  e?.target?.value !== ""
                    ? e.target.classList.remove("border-red-500")
                    : null
                }
                onKeyDown={(e) => {
                  e.key === "Enter" && focusNextInput();
                }}
              />
              <label className="opacity-75 text-xl indent-1" htmlFor="room">
                Sala
              </label>
              <input
                ref={roomRef}
                id="room"
                type="text"
                name="room"
                placeholder="Global"
                className="border rounded-lg p-2 indent-1 mb-4 focus-within:border-[#75fac8] dark:focus-within:border-[#75fac8] dark:bg-white/10 dark:border-white/5 outline-none transition-colors duration-200 shadow"
                onBlur={(e) =>
                  e?.target?.value !== ""
                    ? e.target.classList.remove("border-red-500")
                    : null
                }
                onKeyDown={(e) => {
                  e.key === "Enter" && focusNextInput();
                }}
              />

              <button
                className="anonytalk text-shadow shadow-lg text-white dark:text-white/90 text-xl rounded-lg w-fit p-2 px-4 pressable font-medium"
                type="submit"
              >
                Ingresar
              </button>
            </form>
            <div className="flex gap-4 flex-wrap justify-center sm:mr-auto reveal">
              <DarkMode />
              <Social />
            </div>
          </div>

          <div className="max-w-[35%] sm:max-w-[50%] xl:w-full flex h-fit items-center max-sm:-mb-5">
            <Anonytalk size={576} styles={"h-fit m-auto xl:mr-0"} />
          </div>
        </section>
      ) : (
        <Message
          socket={socket}
          nick={nickRef.current?.value as string}
          room={roomRef.current?.value as string}
          color={color}
        />
      )}
    </>
  );
}
