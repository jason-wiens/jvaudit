import { Session } from "next-auth";
import { Role } from "@prisma/client";

export function adminGuard(session: Session | null): boolean {
  if (!session?.user) return false;
  const roles = session.user.role as Role[];

  if (roles.includes(Role.ADMIN) || roles.includes(Role.SUPER_USER))
    return true;

  return false;
}
