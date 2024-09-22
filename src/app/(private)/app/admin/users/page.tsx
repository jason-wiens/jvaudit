import { FC } from "react";
import { Card } from "@/components/card";
import { TopBar, type Crumb } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Plus, UsersRound } from "lucide-react";

import { UsersContextProvider } from "@/state/users/provider";
import { getUsersDbQuery } from "@/state/users/actions/get-users";
import { withAdminGuard } from "@/components/guards";

import { logError } from "@/lib/logging";
import { ServerError } from "@/components/server-error";
import { UsersTable } from "@/components/tables";
import { AddUser } from "@/components/add-user";
import { Session } from "next-auth/types";
import { DefaultIcons } from "@/lib/default-icons";

type UsersPageProps = {
  session: Session;
};

const UsersPage: FC<UsersPageProps> = async ({ session: { user } }) => {
  const { tenantId } = user;

  const crumbs: Crumb[] = [{ label: "Users", icon: DefaultIcons.Users({}) }];

  try {
    const users = await getUsersDbQuery({ tenantId });
    return (
      <UsersContextProvider users={users}>
        <div className="">
          <TopBar className="justify-between" crumbs={crumbs}>
            <AddUser>
              <Button variant="add" size="sm">
                Add User <Plus size={16} className="ml-2" />
              </Button>
            </AddUser>
          </TopBar>
          <div className="p-8 w-full max-w-container mx-auto flex flex-col gap-8">
            <Card title="Users" className="">
              <UsersTable />
            </Card>
          </div>
        </div>
      </UsersContextProvider>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError({
      error,
      user,
      timestamp: new Date(),
      message,
    });
    return <ServerError message={message} />;
  }
};

export default withAdminGuard(UsersPage);
