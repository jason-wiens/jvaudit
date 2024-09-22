import { useContext } from "react";
import { UsersContext } from "./provider";

export const useUsers = () => {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUsers must be used within a UsersContextProvider");
  }

  return context;
};
