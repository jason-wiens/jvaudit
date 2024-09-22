import { getUsersDbQuery } from "./actions/get-users";
import { AddUserFormInputs } from "@/schemas/user.schema";
import { UpdateUserFormInputs } from "@/schemas/user.schema";
import { ServerActionResponse } from "@/types/types";

export type User = Awaited<ReturnType<typeof getUsersDbQuery>>[0];

export type IUsersContext = {
  users: User[];
  pending: boolean;
  addUser(
    userData: AddUserFormInputs
  ): Promise<ServerActionResponse<AddUserFormInputs, { password: string }>>;
  deactivateUser: (inputs: { userId: User["userId"] }) => void;
  activateUser: (inputs: { userId: User["userId"] }) => void;
  resetPassword: (inputs: {
    userId: User["userId"];
  }) => Promise<ServerActionResponse<{}, { password: string }>>;
  updateUser: (inputs: {
    userId: User["userId"];
    userData: UpdateUserFormInputs;
  }) => void;
};

export enum UserAction {
  UpdateUser = "update:user",
  DeactivateUser = "deactivate:user",
  ActivateUser = "activate:user",
}

export type OptimisticUpdateUser = {
  action: UserAction.UpdateUser;
  payload: {
    userId: User["userId"];
    userData: UpdateUserFormInputs;
  };
};

export type OptimisticDeactivateUser = {
  action: UserAction.DeactivateUser;
  payload: {
    userId: User["userId"];
  };
};

export type OptimisticActivateUser = {
  action: UserAction.ActivateUser;
  payload: {
    userId: User["userId"];
  };
};

export type OptimisticUserAction =
  | OptimisticUpdateUser
  | OptimisticDeactivateUser
  | OptimisticActivateUser;
