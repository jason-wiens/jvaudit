import { Role } from "@prisma/client";

export function isPermitted(required: Role[], userRoles: Role[]): boolean {
  const requiresSuperUser = required.includes(Role.SUPER_USER);
  const requiresAdmin = required.includes(Role.ADMIN);
  const requiresUser = required.includes(Role.USER);

  const isSuperUser = userRoles.includes(Role.SUPER_USER);
  const isAdmin = userRoles.includes(Role.ADMIN);
  const isUser = userRoles.includes(Role.USER);

  if (isSuperUser) return true;
  if (requiresSuperUser && !isSuperUser) return false;

  if (requiresAdmin && isAdmin) return true;
  if (requiresAdmin && !isAdmin) return false;

  if (requiresUser && isUser) return true;
  if (requiresUser && !isUser) return false;

  return false;
}
