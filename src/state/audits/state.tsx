"use server";

import { AuditsContextProvider } from "./provider";
import { getAudits } from "./actions/get-audits";
import { Audit } from "./types";
import { FC, useContext } from "react";
import { checkAdmin } from "@/permissions";
import { NotAuthorized } from "@/components/not-authorized";
import { logError } from "@/lib/logging";
import { ServerError } from "@/components/server-error";

type AuditsStateProviderProps = {
  children: React.ReactNode;
};

export const AuditsStateProvider = async ({
  children,
}: AuditsStateProviderProps) => {
  // check permissions
  const { session } = await checkAdmin();
  if (!session) return <NotAuthorized />;

  const tenantId = session.user.tenantId;

  let audits: Audit[] = [];

  try {
    audits = await getAudits({ tenantId });
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: "Error getting getting audits",
    });
    return (
      <ServerError msg="Unable to get company data from the database. See logs for details." />
    );
  }

  return (
    <AuditsContextProvider audits={audits}>{children}</AuditsContextProvider>
  );
};
