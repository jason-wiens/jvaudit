"use client";

import { createContext, useOptimistic, useTransition } from "react";
import {
  updateUser,
  resetPassword,
  activateUser,
  deactivateUser,
  addUser,
} from "./actions";
import { AddUserFormInputs, UpdateUserFormInputs } from "@/schemas/user.schema";
import { ServerActionResponse } from "@/types/types";
import { IUsersContext, User, OptimisticUserAction, UserAction } from "./types";

import { cleanUndefinedFields } from "@/lib/utils";
import { useAlerts } from "@/state";

export const UsersContext = createContext<IUsersContext | null>(null);

export type UsersContextProviderProps = {
  children: React.ReactNode;
  users: User[];
};

export function UsersContextProvider({
  children,
  users,
}: UsersContextProviderProps) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
  const [optimisticUsers, setOptimisticUsers] = useOptimistic<
    User[],
    OptimisticUserAction
  >(users, (state, { action, payload }) => {
    switch (action) {
      case UserAction.UpdateUser:
        const { userId, userData: updateData } = payload;
        return state.map((user) => {
          if (user.userId === userId) {
            const {
              email,
              position,
              firstName,
              lastName,
              avatarUrl,
              primaryContact,
              admin,
            } = updateData;
            const userData = cleanUndefinedFields({
              admin,
              avatarUrl,
            });
            const employeeData = cleanUndefinedFields({
              position,
              primaryContact,
            });
            const personData = cleanUndefinedFields({
              email,
              firstName,
              lastName,
            });
            return {
              ...user,
              ...userData,
              profile: {
                ...user.profile,
                ...employeeData,
                personalProfile: {
                  ...user.profile.personalProfile,
                  ...personData,
                },
              },
            };
          }
          return user;
        }) as User[];
      case UserAction.DeactivateUser:
        return state.map((user) =>
          user.userId === payload.userId
            ? { ...user, active: false, activeDate: new Date() }
            : user
        );
      default:
        return state;
    }
  });

  const handleOptimisticUpdateUser = (inputs: {
    userId: User["userId"];
    userData: UpdateUserFormInputs;
  }) =>
    startTransaction(async () => {
      setOptimisticUsers({
        action: UserAction.UpdateUser,
        payload: inputs,
      });

      const { success, message, formErrors } = await updateUser(inputs);
      if (!success) {
        if (formErrors) console.log(formErrors);
        addAlert({
          title: "Failed to Update employee.",
          message: message
            ? `${message}. Rollingback changes. Please try again`
            : "Unknown Error. Rollingback changes. Please try again.",
          type: "error",
        });
      }
    });

  const handleOptimisticDeactivateUser = ({
    userId,
  }: {
    userId: User["userId"];
  }) =>
    startTransaction(async () => {
      setOptimisticUsers({
        action: UserAction.DeactivateUser,
        payload: { userId },
      });

      const { success, message } = await deactivateUser({ userId });
      if (!success)
        addAlert({
          title: "Failed to deactivate employee.",
          message: message
            ? `${message}. Rollingback changes. Please try again`
            : "Unknown Error. Rollingback changes. Please try again.",
          type: "error",
        });
    });

  const handleOptimisticActivateUser = ({
    userId,
  }: {
    userId: User["userId"];
  }) =>
    startTransaction(async () => {
      setOptimisticUsers({
        action: UserAction.ActivateUser,
        payload: { userId },
      });

      const { success, message } = await activateUser({ userId });
      if (!success)
        addAlert({
          title: "Failed to activate employee.",
          message: message
            ? `${message}. Rollingback changes. Please try again`
            : "Unknown Error. Rollingback changes. Please try again.",
          type: "error",
        });
    });

  return (
    <UsersContext.Provider
      value={{
        users: optimisticUsers,
        pending,
        addUser,
        updateUser: handleOptimisticUpdateUser,
        deactivateUser: handleOptimisticDeactivateUser,
        activateUser: handleOptimisticActivateUser,
        resetPassword,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
