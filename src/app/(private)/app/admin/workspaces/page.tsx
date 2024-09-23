import { Card } from "@/components/card";
import { TopBar, type Crumb } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { withAdminGuard } from "@/components/guards";
import { Session } from "next-auth/types";
import { getWorkspacesDbQuery } from "@/state/workspaces/actions";
import { WorkspacesContextProvider } from "@/state";
import { logError } from "@/lib/logging";
import { ServerError } from "@/components/server-error";
import { DefaultIcons } from "@/lib/default-icons";
import { AppRoutes } from "@/lib/routes.app";
import { handleServerError } from "@/lib/handle-server-errors";

type WorkspacesProps = {
  session: Session;
};

const Workspaces: FC<WorkspacesProps> = async ({ session }) => {
  const { tenantId, defaultWorkspaceId } = session.user;

  const crumbs: Crumb[] = [
    { label: "Workspaces", icon: DefaultIcons.Workspaces({}) },
  ];

  try {
    const workspaces = await getWorkspacesDbQuery({ tenantId });
    return (
      <WorkspacesContextProvider workspaces={workspaces}>
        <TopBar className="justify-between" crumbs={crumbs}>
          <Button variant="add" size="sm">
            Add Workspace <Plus size={16} className="ml-2" />
          </Button>
        </TopBar>
        <div className="p-8 w-full max-w-container mx-auto">
          <Card title="Companies">Table Here</Card>
        </div>
      </WorkspacesContextProvider>
    );
  } catch (error) {
    const { message } = handleServerError({
      error,
      message: "Failed to get workspaces",
      user: session.user,
    });
    return <ServerError message={message} />;
  }
};

export default withAdminGuard(Workspaces);
