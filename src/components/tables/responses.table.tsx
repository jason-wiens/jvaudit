"use client";

import { AddInformationRequest } from "@/components/add-ir";
import { Button } from "@/components/ui/button";
import { ColumnDef, DataTable } from "@/components/data-table";
import { Building2, CircleCheck, Plus, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";
import { Audit } from "@prisma/client";

type TableData = {
  number: string;
  subject: string;
  subjectDetails: string;
  author: {
    personalProfile: {
      firstName: string;
      lastName: string;
    };
  };
  grossAmount: number;
  netAmount: number;
  resolved: boolean;
};

export const ResponseTable: FC = () => {
  const columns: ColumnDef<TableData>[] = [
    {
      id: "number",
      label: "Number",
      sortableValue: (row) => row.number,
      searchableValue: (row) => `${row.number}`,
      renderCell: (row) => <div className="w-8">{row.number}</div>,
      skeleton: () => <Skeleton className="w-[32px] h-4 rounded" />,
    },
    {
      id: "subject",
      renderCell: (row) => <>{row.subject}</>,
      sortableValue: (row) => row.subject || "zzzz",
      searchableValue: (row) => row.subject || "",
      label: "Subject",
      skeleton: () => <Skeleton className="w-[150px] h-4 rounded" />,
    },
    {
      id: "subjectDetails",
      renderCell: (row) => <>{row.subjectDetails}</>,
      sortableValue: (row) => row.subjectDetails || "zzzz",
      searchableValue: (row) => row.subjectDetails || "",
      label: "Subject Details",
      skeleton: () => <Skeleton className="w-[250px] h-4 rounded" />,
    },
    {
      id: "author",
      renderCell: (row) => (
        <>{`${row.author.personalProfile.firstName} ${row.author.personalProfile.lastName}`}</>
      ),
      sortableValue: (row) =>
        `${row.author.personalProfile.lastName} ${row.author.personalProfile.firstName}`,
      searchableValue: (row) =>
        `${row.author.personalProfile.firstName} ${row.author.personalProfile.lastName}`,
      label: "Author",
      skeleton: () => <Skeleton className="w-[150px] h-4 rounded" />,
    },
    {
      id: "grossAmount",
      renderCell: (row) => (
        <div className="w-full flex justify-center">
          {row.grossAmount || "-"}
        </div>
      ),
      sortableValue: (row) => row.grossAmount || 0,
      align: "center",
      label: "Gross Amount",
      skeleton: () => <Skeleton className="w-[32px] h-4 rounded" />,
    },
    {
      id: "netAmount",
      renderCell: (row) => (
        <div className="w-full flex justify-center">{row.netAmount || "-"}</div>
      ),
      sortableValue: (row) => row.netAmount || 0,
      align: "center",
      label: "Net Amount",
      skeleton: () => <Skeleton className="w-[32px] h-4 rounded" />,
    },
    {
      id: "resolved",
      label: "Resolved",
      sortableValue: (row) => `${row.resolved}`,
      renderCell: (row) => {
        return (
          <Badge variant={row.resolved ? "green" : "destructive"} className="">
            {row.resolved ? "Resolved" : "UNRESOLVED"}
          </Badge>
        );
      },
      skeleton: () => <Skeleton className="w-[100px] h-4 rounded" />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={[]}
      searchable={true}
      rowIdKey="number"
    />
  );
};
