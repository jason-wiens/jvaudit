import prisma from "@/lib/db";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/schemas/login.schema";
import { User } from "next-auth";

import { AppRoutes } from "@/lib/routes.app";
import { logError } from "@/lib/logging";
import { generateRandomId } from "@/lib/utils";

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
            profile: {
              include: {
                personalProfile: true,
              },
            },
            tenant: true,
          },
        });

        if (!user) {
          logError({
            id: generateRandomId(),
            timestamp: new Date(),
            message: `User not found: ${username}`,
            error: new Error(`User not found: ${username}`),
          });
          return null;
        }

        if (!user.active) {
          logError({
            id: generateRandomId(),
            timestamp: new Date(),
            message: `User is inactive: ${username}`,
            error: new Error(`User is inactive: ${username}`),
          });
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
          firstName: user.profile.personalProfile.firstName,
          lastName: user.profile.personalProfile.lastName,
          email: user.profile.personalProfile.email,
          avatarUrl: user.avatarUrl,
          isAdmin: user.admin,
          isSuperUser: user.superUser,
          tenantId: user.tenant.tenantId,
          employeeId: user.profileId,
          defaultWorkspaceId: user.defaultWorkspaceId,
          companyId: user.profile.companyId,
          forcePasswordChange: user.forcePasswordChange,
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
    redirect: async ({ url, baseUrl }) => {
      // If the url is an internal path, use it; otherwise, redirect to dashboard
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}${AppRoutes.AppPage()}`;
    },
    authorized: async ({ auth, request }) => {
      // runs on every request to middleware
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      const isTryingToAccessAPI = request.nextUrl.pathname.includes("/api");

      if (isTryingToAccessAPI) return true;

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

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
        token.isAdmin = user.isAdmin;
        token.isSuperUser = user.isSuperUser;
        token.tenantId = user.tenantId;
        token.employeeId = user.employeeId;
        token.companyId = user.companyId;
        token.defaultWorkspaceId = user.defaultWorkspaceId;
        token.forcePasswordChange = user.forcePasswordChange;
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
        session.user.isAdmin = token.isAdmin;
        session.user.isSuperUser = token.isSuperUser;
        session.user.tenantId = token.tenantId;
        session.user.employeeId = token.employeeId;
        session.user.companyId = token.companyId;
        session.user.defaultWorkspaceId = token.defaultWorkspaceId;
        session.user.forcePasswordChange = token.forcePasswordChange;
      }
      return session;
    },
  },
});
