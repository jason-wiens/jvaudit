import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Alerts } from "@/components/alerts";

import {
  UserContextProvider,
  TenantContextProvider,
  WorkspaceContextProvider,
} from "@/state";
import { getUserDbQuery } from "@/state/user-current/actions";
import { getTenantDbQuery } from "@/state/tenant/actions";
import { getWorkspaceDbQuery } from "@/state/workspace/actions";
import { checkAuthorized } from "@/permissions";
import { handleServerError } from "@/lib/handle-server-errors";
import { ServerError } from "@/components/server-error";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkAuthorized();
  const userId = session.user.userId;
  const tenantId = session.user.tenantId;

  try {
    const user = await getUserDbQuery({ tenantId, userId });
    if (!user) throw new Error("User not found");

    const [workspace, tenant] = await Promise.all([
      getWorkspaceDbQuery({ workspaceId: user?.defaultWorkspaceId, tenantId }),
      getTenantDbQuery({ tenantId }),
    ]);
    if (!workspace) throw new Error("Workspace not found");
    if (!tenant) throw new Error("Tenant not found");

    return (
      <UserContextProvider user={user}>
        <TenantContextProvider tenant={tenant}>
          <WorkspaceContextProvider workspace={workspace}>
            <div className="min-h-screen w-full h-1">
              <Header />
              <div className="flex w-full h-full relative">
                <Alerts />
                <div className="w-56">
                  <Sidebar />
                </div>
                <div className="flex-1">{children}</div>
              </div>
            </div>
          </WorkspaceContextProvider>
        </TenantContextProvider>
      </UserContextProvider>
    );
  } catch (error) {
    const { message } = handleServerError({
      error,
      message: "Error getting user, tenant, or workspace",
      user: session.user,
    });
    return <ServerError message={message} />;
  }
}
