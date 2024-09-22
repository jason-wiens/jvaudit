"use client";

import { createContext, useEffect, useState } from "react";
import { User, IUserContext } from "./types";

type UserContextProviderProps = {
  children: React.ReactNode;
  user: User;
};

export const UserContext = createContext<IUserContext | null>(null);

export function UserContextProvider({
  children,
  user,
}: UserContextProviderProps) {
  return (
    <UserContext.Provider
      value={{
        currentUser: user,
        isAdmin: user.admin,
        isSuperUser: user.superUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
