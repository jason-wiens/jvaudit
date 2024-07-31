import CompanyContextProvider from "./companies/company-context.provider";
import AuditsContextProvider from "./audits/audits-context.provider";

import { getCompanies } from "@/actions/companies";
import { getAllAudits } from "@/actions/audits";

export async function AdminStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const companies = await getCompanies({});
  const audits = await getAllAudits();
  return (
    <CompanyContextProvider companies={companies}>
      <AuditsContextProvider audits={audits}>{children}</AuditsContextProvider>
    </CompanyContextProvider>
  );
}
