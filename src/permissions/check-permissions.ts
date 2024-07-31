import { Session } from "next-auth/types";
import { checkAuth } from "./check-auth";
import { isPermitted } from "./is-permitted";
import { Role } from "@prisma/client";

type CheckPermissionsInputs = {
  accessLevelRequired: Role;
};

export async function checkAuthAndPermissions({
  accessLevelRequired,
}: CheckPermissionsInputs): Promise<Session | null> {
  const session = await checkAuth();
  const userPermissionRoles = session.user.role;
  if (isPermitted([accessLevelRequired], userPermissionRoles)) {
    return session;
  }

  return null;
}
