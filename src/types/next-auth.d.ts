import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    role: string[];
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
    role: string[];
  }
}
