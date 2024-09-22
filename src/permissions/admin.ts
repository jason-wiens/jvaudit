import { AppRoutes } from "@/lib/routes.app";
import { auth } from "@/state";
import { Session } from "next-auth/types";
import { redirect } from "next/navigation";

type AuthorizedResponse = {
  session: Session;
  message: never;
};

type UnauthorizedResponse = {
  session: never;
  message: string;
};

export const checkAdmin = async (): Promise<
  AuthorizedResponse | UnauthorizedResponse
> => {
  const session = await auth();

  if (!session) {
    return redirect(AppRoutes.LoginPage());
  }

  if (!session.user.isAdmin) {
    return {
      message: "You are not authorized to perform this action",
    } as UnauthorizedResponse;
  }

  return { session } as AuthorizedResponse;
};
