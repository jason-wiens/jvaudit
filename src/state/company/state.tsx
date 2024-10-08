"use client";

import { CompanyContextProvider } from "./provider";
import { useAlerts, useCompanies } from "@/state";
import { useStringParam } from "@/hooks";
import { useRouter } from "next/navigation";
import { Company } from "./types";
import { useEffect, useState } from "react";
import { AppRoutes } from "@/lib/routes.app";
import { ServerError } from "@/components/server-error";

type CompanyStateProviderProps = {
  children: React.ReactNode;
};

export const CompanyStateProvider: React.FC<CompanyStateProviderProps> = ({
  children,
}) => {
  const { companies } = useCompanies();
  const [company, setCompany] = useState<Company | null>(null);
  const companyId = useStringParam("companyId");
  const router = useRouter();
  const { addAlert } = useAlerts();

  useEffect(() => {
    if (!companyId) {
      addAlert({
        title: "Something went wrong.",
        message: "No companyId found in the URL",
        type: "error",
      });
      router.push(AppRoutes.Companies());
    }

    setCompany(companies.find((c) => c.companyId === companyId) || null);
  }, [companyId, companies]);

  if (!companies || companies.length === 0)
    return <ServerError message="No companies found" />;

  return (
    <CompanyContextProvider company={company}>
      {children}
    </CompanyContextProvider>
  );
};
