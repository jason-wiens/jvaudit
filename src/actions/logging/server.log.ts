"use server";

import { User } from "next-auth/types";

export const logServer = (log: {
  tenantId: string;
  user: User;
  message: any;
}) => {
  console.log({
    time: new Date(),
    tenantId: log.tenantId,
    user: log.user,
    message: log.message,
  });
};
