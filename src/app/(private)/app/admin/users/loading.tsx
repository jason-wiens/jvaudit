import { Card } from "@/components/card";
import { SkeletonTable } from "@/components/data-table";
import { TopBar, type Crumb } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usersTableColumns } from "@/components/tables";
import { DefaultIcons } from "@/lib/default-icons";

export default function UsersPage() {
  const crumbs: Crumb[] = [{ label: "Users", icon: DefaultIcons.Users({}) }];
  return (
    <div className="">
      <TopBar className="justify-between" crumbs={crumbs}>
        <Button variant="add" size="sm">
          Add User <Plus size={16} className="ml-2" />
        </Button>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto flex flex-col gap-8">
        <Card title="Users" className="">
          <SkeletonTable columns={usersTableColumns} searchable showFooter />
        </Card>
      </div>
    </div>
  );
}
