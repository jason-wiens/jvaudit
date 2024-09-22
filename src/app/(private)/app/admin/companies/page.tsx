import { TopBar } from "@/components/top-bar";
import { AddCompany } from "@/components/add-company";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/card";

import CompaniesTable from "./companies.table";

import { Plus, Building } from "lucide-react";
import React from "react";

const Companies: React.FC = () => {
  return (
    <div className="">
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
    </div>
  );
};

export default Companies;
