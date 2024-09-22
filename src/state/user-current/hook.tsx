import { useContext } from "react";
import { UserContext } from "./provider";

export const useCurrentUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
};
