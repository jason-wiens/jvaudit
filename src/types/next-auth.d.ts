import type { Role } from "@prisma/client";
import type { User } from "next-auth";

declare module "next-auth" {
  interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    isAdmin: boolean;
    isSuperUser: boolean;
    tenantId: string;
    employeeId: string;
    companyId: string;
    defaultWorkspaceId: string;
    forcePasswordChange: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    isAdmin: boolean;
    isSuperUser: boolean;
    tenantId: string;
    employeeId: string;
    companyId: string;
    defaultWorkspaceId: string;
    forcePasswordChange: boolean;
  }
}
