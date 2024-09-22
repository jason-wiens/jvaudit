"use server";

import { TopBar } from "@/components/top-bar";
import { Building } from "lucide-react";

import { AuditsTable } from "@/components/tables/audits.table";
import { NotAuthorized } from "@/components/not-authorized";
import { logError } from "@/lib/logging";
import { Card } from "@/components/card";
import { withAdminGuard } from "@/components/guards";
import { Session } from "next-auth/types";
import { FC } from "react";

type AuditsProps = {
  session: Session;
};

const UserAudits: FC<AuditsProps> = async ({ session }) => {
  // let userAudits: UserAudit[] = [];

  // try {
  //   userAudits = await getUserAudits({ userId, tenantId });
  // } catch (error) {
  //   logError({
  //     timestamp: new Date(),
  //     user: session.user,
  //     error,
  //     message: "Error getting getting audits",
  //   });
  // }

  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          <Building className="mr-2" size={16} />
          <span>Audits</span> / Dashboard
        </div>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto">
        <Card title="My Audits">
          <AuditsTable audits={[]} />
        </Card>
      </div>
    </div>
  );
};

export default withAdminGuard(UserAudits);
