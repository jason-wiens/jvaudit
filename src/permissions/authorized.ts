import { AppRoutes } from "@/lib/routes.app";
import { auth } from "@/state";
import { redirect } from "next/navigation";

export const checkAuthorized = async () => {
  const session = await auth();

  if (!session) {
    return redirect(AppRoutes.LoginPage());
  }

  return session;
};
