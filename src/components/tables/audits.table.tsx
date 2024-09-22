"use client";

import { AddAudit } from "@/components/add-audit";
import { Button } from "@/components/ui/button";
import { ColumnDef, DataTable } from "@/components/data-table";
import { Building2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";
import type { Audit } from "@/state/audits/types";
import { StakeholderType, AuditStatus } from "@prisma/client";
import { useWorkspace } from "@/state";

export const auditsTableColumns: ColumnDef<Audit>[] = [
  {
    id: "auditNumber",
    label: "Audit Number",
    sortableValue: (row) => row.auditNumber,
    searchableValue: (row) => row.auditNumber,
    renderCell: (row) => <>{row.auditNumber}</>,
    skeleton: () => <Skeleton className="w-[100px] h-4 rounded" />,
  },
  {
    id: "auditDescription",
    renderCell: (row) => <>{row.auditDescription}</>,
    sortableValue: (row) => row.auditDescription,
    searchableValue: (row) => row.auditDescription,
    label: "Description",
    skeleton: () => <Skeleton className="w-[250px] h-4 rounded" />,
  },
  {
    id: "operator",
    label: "Operator",
    sortableValue: (row) =>
      row.stakeholders.find((s) => s.type === StakeholderType.OPERATOR)?.company
        .shortName || "zzzzz", // sort on zzzz to put at the end
    searchableValue: (row) =>
      row.stakeholders.find((s) => s.type === StakeholderType.OPERATOR)?.company
        .shortName || "",
    renderCell: (row) => {
      const operator = row.stakeholders.find(
        (s) => s.type === StakeholderType.OPERATOR
      );
      if (!operator) return null;
      return (
        <div className="w-full flex items-center gap-2">
          <Building2 size={16} />
          {operator.company.shortName}
        </div>
      );
    },
    skeleton: () => <Skeleton className="w-[250px] h-4 rounded" />,
  },
  {
    id: "lead",
    label: "Audit Lead",
    sortableValue: (row) =>
      row.stakeholders.find((s) => s.type === StakeholderType.AUDIT_LEAD)
        ?.company.shortName || "zzzzz",
    searchableValue: (row) =>
      row.stakeholders.find((s) => s.type === StakeholderType.AUDIT_LEAD)
        ?.company.shortName || "",
    renderCell: (row) => {
      const lead = row.stakeholders.find(
        (s) => s.type === StakeholderType.AUDIT_LEAD
      );
      if (!lead) return null;
      return (
        <div className="w-full flex items-center gap-2">
          <Building2 size={16} />
          {lead.company.shortName}
        </div>
      );
    },
    skeleton: () => <Skeleton className="w-[250px] h-4 rounded" />,
  },
  {
    id: "status",
    label: "Status",
    sortableValue: (row) => row.status,
    searchableValue: (row) => row.status,
    renderCell: (row) => {
      let color:
        | "yellow"
        | "secondary"
        | "green"
        | "destructive"
        | "default"
        | "primary"
        | "accent"
        | "outline" = "default";
      switch (row.status) {
        case AuditStatus.CREATED:
          color = "yellow";
          break;
        case AuditStatus.CONFIRMED:
        case AuditStatus.FIELDWORK:
        case AuditStatus.REPORTING:
          color = "secondary";
          break;
        case AuditStatus.SUBMITTED:
        case AuditStatus.RESPONSE:
        case AuditStatus.CLOSED:
          color = "green";
          break;
        case AuditStatus.CANCELLED:
          color = "destructive";
          break;
        default:
          break;
      }
      return (
        <Badge variant={color} className="">
          {row.status}
        </Badge>
      );
    },
    skeleton: () => <Skeleton className="w-[100px] h-4 rounded" />,
  },
];

type AuditsTableProps = {
  audits: Audit[];
};

export const AuditsTable: FC<AuditsTableProps> = ({ audits }) => {
  const router = useRouter();
  const {
    workspace: { workspaceId },
  } = useWorkspace();

  const onRowClick = ({ auditId }: Audit) => {
    router.push(AppRoutes.Audit({ auditId, workspaceId }));
  };

  return (
    <DataTable
      columns={auditsTableColumns}
      data={audits}
      onRowClick={onRowClick}
      searchable={true}
      rowIdKey="auditId"
    />
  );
};
