"use client";

import { useRouter } from "next/navigation";

import { TopBar } from "@/components/top-bar";
import { Building } from "lucide-react";

import { AddAudit } from "@/components/add-audit";
import { useAuditsContext } from "@/hooks/context.hook";
import { Button } from "@/components/ui/button";

import { AppRoutes } from "@/lib/routes.app";

import { auditTableColumns } from "./audit.table";
import { DataTable } from "@/components/data-table";
import { Plus } from "lucide-react";

export default function AdminAudits() {
  const { audits } = useAuditsContext();
  const router = useRouter();

  const onRowClick = (row: Audit) => {
    router.push(AppRoutes.AdminAudit({ auditId: row.id }));
  };

  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          <Building className="mr-2" size={16} />
          <span>Audits</span> / Dashboard
        </div>
        <AddAudit>
          <Button variant="add" size="sm">
            Add Audit <Plus size={16} className="ml-2" />
          </Button>
        </AddAudit>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto">
        <DataTable
          columns={auditTableColumns}
          data={audits}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
}
