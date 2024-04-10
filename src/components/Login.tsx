import { ChangeEvent, useContext } from "react";
import { Anonytalk, SendIcon } from "./Icons";
import { Socket } from "socket.io-client";
import { focusNextInput } from "@/lib/utils";
import DarkMode from "./DarkMode";
import Context from "@/context";

function Login({
  socket,
}: {
  socket: Socket;
}) {
  const { user, setUser } = useContext(Context);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nick = e.target.nick.value;
    const room = e.target.room.value;

    if (nick.length === 0 || room.length === 0) {
      return null;
    }

    setUser({
      ...user,
      nick,
      room,
    });

    socket.emit("join_room", [nick, room]);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 max-md:gap-y-5 justify-around place-content-center h-dvh items-center max-w-screen-xl w-[90%] mx-auto">
      <section className="space-y-10 max-w-sm mx-auto w-full max-md:order-1">
        <div className="w-max mx-auto">
          <h1 className="text-5xl md:text-7xl opacity-90 w-full">Anonytalk</h1>
          <h2 className="md:text-xl opacity-90 w-fit ml-auto -tracking-wider">
            {"Chatea Anonimamente : )"}
          </h2>
        </div>

        <form
          onSubmit={(e: ChangeEvent<HTMLFormElement>) => handleSubmit(e)}
          className="relative z-10 space-y-2.5 p-8 text-xl rounded-2xl shadow-xl bg-white/90 dark:bg-transparent backdrop-blur-md border border-black/[2%] dark:border-white/10"
        >
          <label
            className="opacity-75 indent-1 flex flex-col relative"
            htmlFor="nick"
          >
            <span className="text-lg">Nick</span>
            <input
              id="nick"
              type="text"
              name="nick"
              placeholder="John"
              className="rounded-lg p-2 pr-8 indent-1 input shadow"
              onBlur={(e) =>
                e?.target?.value.trim() === ""
                  ? e.target.classList.add("invalid")
                  : e.target.classList.remove("invalid")
              }
              onKeyDown={(e) => {
                e.key === "Enter" && focusNextInput();
              }}
            />
            <input
              defaultValue={user.color}
              onChange={(e) => setUser({ ...user, color: e.target.value, colorIcon: e.target.value })}
              id="color"
              type="color"
              className="h-3.5 w-3.5 rounded-full overflow-hidden cursor-pointer border absolute bottom-4 right-3"
            />
          </label>
          <label className="opacity-75 indent-1 flex flex-col" htmlFor="room">
            <span className="text-lg">Sala</span>
            <input
              id="room"
              type="text"
              name="room"
              placeholder="Global"
              className="rounded-lg p-2 indent-1 input shadow"
              onBlur={(e) =>
                e?.target?.value.trim() === ""
                  ? e.target.classList.add("invalid")
                  : e.target.classList.remove("invalid")
              }
              onKeyDown={(e) => {
                e.key === "Enter" && focusNextInput();
              }}
            />
          </label>

          <button
            className="text-white dark:text-black bg-black dark:bg-white flex items-center gap-1.5 shadow-lg text-base rounded-lg w-fit py-1.5 px-4 press font-medium"
            type="submit"
          >
            Chatear
            <SendIcon />
          </button>
        </form>

        <DarkMode className="text-sm" />
      </section>

      <div className="icon-shadow" style={{"--icon-shadow": user.colorIcon} as React.CSSProperties}>
        <Anonytalk size={"50%"} className="max-md:w-[6em]" />
      </div>
    </section>
  );
}

export default Login;
