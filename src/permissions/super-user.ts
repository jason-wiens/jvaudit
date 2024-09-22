import { AppRoutes } from "@/lib/routes.app";
import { auth } from "@/state";
import { Session } from "next-auth/types";
import { redirect } from "next/navigation";

type AuthorizedResponse = {
  session: Session;
  message: null;
};

type UnauthorizedResponse = {
  session: null;
  message: string;
};

export const checkSuperUser = async (): Promise<
  AuthorizedResponse | UnauthorizedResponse
> => {
  const session = await auth();

  if (!session) {
    return redirect(AppRoutes.LoginPage());
  }

  if (!session.user.isSuperUser) {
    return {
      message: "You are not authorized to perform this action",
      session: null,
    };
  }

  return { session, message: null };
};
