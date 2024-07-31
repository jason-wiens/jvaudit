import prisma from "./db";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/schemas/login.schema";
import { User } from "next-auth";

import { userGuard, adminGuard } from "@/guards";
import { AppRoutes } from "./routes.app";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login
        const validatedCredentials = loginSchema.safeParse(credentials);
        if (!validatedCredentials.success) {
          console.log("Invalid credentials");
          return null;
        }
        const { username, password } = validatedCredentials.data;

        const user = await prisma.user.findUnique({
          where: {
            username,
          },
          include: {
            profile: true,
            tenant: true,
          },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.log("Password is incorrect");
          return null;
        }

        const serializedUser: User = {
          id: user.userId,
          userId: user.userId,
          username: user.username,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          email: user.profile.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
          tenantId: user.tenant.tenantId,
          tenantName: user.tenant.name,
        };

        return serializedUser;
      },
    }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      // runs on every request to middleware
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      const isTryingToAccessAdmin = request.nextUrl.pathname.includes("/admin");
      const isTryingToAccessAPI = request.nextUrl.pathname.includes("/api");

      if (isTryingToAccessAPI) return true;

      if (!isTryingToAccessAdmin && !isTryingToAccessApp && !isLoggedIn)
        return true;

      if (isLoggedIn && !isTryingToAccessAdmin && !isTryingToAccessApp) {
        return Response.redirect(
          new URL(AppRoutes.Dashboard(), request.nextUrl)
        );
      }

      if (isTryingToAccessApp) return userGuard(auth);
      if (isTryingToAccessAdmin) return adminGuard(auth);

      return false;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email || "";
        token.avatarUrl = user.avatarUrl || "";
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.userId = token.userId;
        session.user.username = token.username;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.avatarUrl = token.avatarUrl;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
        session.user.tenantName = token.tenantName;
      }
      return session;
    },
  },
});
