import { TopBar } from "@/components/top-bar";
import { Building } from "lucide-react";

import { Button } from "@/components/ui/button";

import { companyTableColumns } from "./companies.table";
import { Plus } from "lucide-react";
import { SkeletonTable } from "@/components/data-table";

export default function AdminCompaniesLoading() {
  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          <Building className="mr-2" size={16} />
          <span>Audits</span> / Dashboard
        </div>
        <Button variant="add" size="sm">
          Add Audit <Plus size={16} className="ml-2" />
        </Button>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto">
        <SkeletonTable columns={companyTableColumns} searchable showFooter />
      </div>
    </div>
  );
}
