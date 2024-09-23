import { TopBar } from "@/components/top-bar";
import { AddCompany } from "@/components/add-company";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/card";
import { withAdminGuard } from "@/components/guards";
import { CompaniesContextProvider } from "@/state/companies/provider";
import { getCompanies } from "@/state/companies/actions/get-companies";

import CompaniesTable from "./companies.table";

import { Plus, Building } from "lucide-react";
import { FC } from "react";
import { Session } from "next-auth/types";
import { handleServerError } from "@/lib/handle-server-errors";
import { ServerError } from "@/components/server-error";

type CompaniesProps = {
  session: Session;
};

const Companies: FC<CompaniesProps> = async ({ session }) => {
  const tenantId = session.user.tenantId;

  try {
    const companies = await getCompanies({ tenantId });

    return (
      <CompaniesContextProvider companies={companies}>
        <TopBar className="justify-between">
          <div className="flex items-center">
            <Building className="mr-2" size={16} />
            Companies / Dashboard
          </div>
          <AddCompany>
            <Button variant="add" size="sm">
              Add Company <Plus size={16} className="ml-2" />
            </Button>
          </AddCompany>
        </TopBar>
        <div className="p-8 w-full max-w-container mx-auto">
          <Card title="Companies">
            <CompaniesTable />
          </Card>
        </div>
      </CompaniesContextProvider>
    );
  } catch (error) {
    const { message } = handleServerError({
      error,
      user: session.user,
      message: "Error getting companies",
    });
    return <ServerError message={message} />;
  }
};

export default withAdminGuard(Companies);
