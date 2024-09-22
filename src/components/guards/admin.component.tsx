"use server";

import React from "react";
import { auth } from "@/state/auth/next-auth.config";
import { redirect } from "next/navigation";
import type { Session } from "next-auth/types";
import { AppRoutes } from "@/lib/routes.app";
import { NotAuthorized } from "@/components/not-authorized";

function withAdminGuard<P extends object>(
  WrappedComponent: React.ComponentType<P & { session: Session }>
) {
  const AdminGuard: React.FC<P> = async (props) => {
    const session = await auth();

    if (!session) {
      return redirect(AppRoutes.LoginPage());
    }

    if (!session.user.isAdmin) return <NotAuthorized />;

    return <WrappedComponent {...props} session={session} />;
  };

  return AdminGuard;
}

export default withAdminGuard;
