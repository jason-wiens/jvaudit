import { Card } from "@/components/card";
import { SkeletonTable } from "@/components/data-table";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
// import { workspacesTableColumns } from "@/components/tables";
import { DefaultIcons } from "@/lib/default-icons";
import { Plus } from "lucide-react";

export default function LoadingWorkspaces() {
  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          {DefaultIcons.Workspaces({ className: "mr-2" })}
          Admin / Workspaces
        </div>
        <Button variant="add" size="sm">
          Add Workspace <Plus size={16} className="ml-2" />
        </Button>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto flex flex-col gap-8">
        <Card title="Users" className="">
          {/* <SkeletonTable
            columns={workspacesTableColumns}
            searchable
            showFooter
          /> */}
          Table Hers
        </Card>
      </div>
    </div>
  );
}
