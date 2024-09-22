import { TopBar } from "@/components/top-bar";
import { Building } from "lucide-react";

import { userAuditsTableColumns } from "../../../../../components/tables/audits.table";
import { SkeletonTable } from "@/components/data-table";

export default function Loading() {
  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          <Building className="mr-2" size={16} />
          <span>Audits</span> / Dashboard
        </div>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto">
        <SkeletonTable columns={userAuditsTableColumns} />
      </div>
    </div>
  );
}
