"use server";

import { CompaniesContextProvider } from "./provider";
import { getCompanies } from "./actions/get-companies";
import { Company } from "./types";
import { checkAdmin } from "@/permissions";
import { redirect } from "next/navigation";
import { logError } from "@/lib/logging";
import { ServerError } from "@/components/server-error";

type CompaniesStateProviderProps = {
  children: React.ReactNode;
};

export const CompaniesStateProvider: React.FC<
  CompaniesStateProviderProps
> = async ({ children }) => {
  // check permissions
  const { session } = await checkAdmin();
  if (!session) return redirect("/login");

  const tenantId = session.user.tenantId;

  let companies: Company[] = [];

  try {
    companies = await getCompanies({ tenantId });
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
    <CompaniesContextProvider companies={companies}>
      {children}
    </CompaniesContextProvider>
  );
};
