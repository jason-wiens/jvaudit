import { getUserDbQuery } from "./actions/get-user";

export type User = NonNullable<Awaited<ReturnType<typeof getUserDbQuery>>>;

export type IUserContext = {
  currentUser: User;
  isAdmin: boolean;
  isSuperUser: boolean;
};
