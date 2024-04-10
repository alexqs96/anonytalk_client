"use client";

import { createContext, useState } from "react";
import { IUser, setStateType } from "./lib/types";
import { generateNickColor } from "./lib/utils";

interface UserContext {
  user: IUser,
  setUser: setStateType<IUser>
}

const userDefaultValues = {
  nick: "",
  room: "",
  color: generateNickColor(),
  colorIcon: null
}

const Context = createContext<UserContext>({
  user: userDefaultValues,
  setUser: () => {}
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<IUser>(userDefaultValues);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
};

export default Context;
