import { auth } from "@/state/auth/next-auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AppRoutes } from "./lib/routes.app";

export async function middleware(req: NextRequest) {
  const session = await auth();

  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.includes("/auth");
  const isApiRoute = pathname.includes("/api");
  const isAppRoute = pathname.includes("/app");

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (!session) {
    // If no token and not on an auth page, redirect to login
    if (isAppRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  } else {
    // If user needs to change password
    if (
      session.user.forcePasswordChange &&
      pathname !== AppRoutes.ChangePassword()
    ) {
      return NextResponse.redirect(
        new URL(AppRoutes.ChangePassword(), req.url)
      );
    }

    // If authenticated user tries to access auth pages, redirect to dashboard
    if (isAuthRoute && !session.user.forcePasswordChange) {
      return NextResponse.redirect(new URL(AppRoutes.AppPage(), req.url));
    }
  }

  return NextResponse.next();
}

export default auth;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
