"use client";

import { AddAudit } from "@/components/add-audit";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@/components/data-table";
import { Building2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { AuditStatus, StakeholderType } from "@/types/enums";

export const auditTableColumns: ColumnDef<Audit>[] = [
  {
    id: "auditNumber",
    label: "Audit Number",
    value: (row) => row.auditNumber,
    renderCell: (row) => <>{row.auditNumber}</>,
    sortable: true,
    renderFooter: () => (
      <div className="py-2">
        <AddAudit>
          <Button variant="ghost" size="sm">
            <Plus size={16} className="mr-2" />
            Add Audit
          </Button>
        </AddAudit>
      </div>
    ),
  },
  {
    id: "auditDescription",
    renderCell: (row) => <>{row.auditDescription}</>,
    value: (row) => row.auditDescription,
    label: "Description",
    sortable: true,
  },
  {
    id: "operator",
    label: "Operator",
    sortable: true,
    value: (row) =>
      row.stakeholders.find((s) => s.type === StakeholderType.OPERATOR)?.company
        .shortName || "zzzzz",
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
  },
  {
    id: "lead",
    label: "Audit Lead",
    sortable: true,
    value: (row) =>
      row.stakeholders.find((s) => s.type === StakeholderType.AUDIT_LEAD)
        ?.company.shortName || "zzzzz",
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
  },
  {
    id: "status",
    label: "Status",
    sortable: true,
    value: (row) => row.status,
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
        case AuditStatus.PREPERATION:
        case AuditStatus.FIELDWORK:
        case AuditStatus.REPORTING:
          color = "secondary";
          break;
        case AuditStatus.SUBMITTED:
        case AuditStatus.RESOLVED:
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
  },
];
