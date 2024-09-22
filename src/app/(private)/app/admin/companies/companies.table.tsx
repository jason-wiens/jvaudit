"use client";

import { AddCompany } from "@/components/add-company";
import { Button } from "@/components/ui/button";

import { useCompanies } from "@/state";

import { ColumnDef, DataTable } from "@/components/data-table";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";

import type { Company } from "@/state/company/types";

export const companyTableColumns: ColumnDef<Company>[] = [
  {
    id: "fullLegalName",
    label: "Company Name",
    sortableValue: (row) => row.fullLegalName,
    renderCell: (row) => (
      <div className="h-6 font-semibold">{row.fullLegalName}</div>
    ),
    renderFooter: () => (
      <div className="py-2">
        <AddCompany>
          <Button variant="ghost" size="sm">
            <Plus size={16} className="mr-2" />
            Add Company
          </Button>
        </AddCompany>
      </div>
    ),
    skeleton: () => <Skeleton className="w-40 h-6 rounded" />,
  },
  {
    id: "shortName",
    renderCell: (row) => <>{row.shortName}</>,
    sortableValue: (row) => row.shortName,
    label: "Short Name",
    skeleton: () => <Skeleton className="w-20 h-6 rounded" />,
  },
  {
    id: "address",
    label: "Address",
    renderCell: (row) => <>{row.address}</>,
    skeleton: () => <Skeleton className="w-40 h-6 rounded" />,
  },
  {
    id: "primary",
    label: "Primary Contact",
    sortableValue: (row) =>
      row.employees.find((e) => e.primaryContact)?.personalProfile.lastName ||
      "zzzzz",
    renderCell: (row) => {
      const employee = row.employees.find((e) => e.primaryContact);
      return (
        <div className="flex items-center">
          {!!employee ? (
            <>
              {`${employee.personalProfile.lastName}, ${employee.personalProfile.firstName}`}
            </>
          ) : (
            "No Primary Contact"
          )}
        </div>
      );
    },
    skeleton: () => <Skeleton className="w-32 h-6 rounded" />,
  },
  {
    id: "employees",
    label: "Employee Count",
    align: "center",
    renderCell: (row) => (
      <div className="flex justify-center">
        {row.employees && row.employees.length ? row.employees.length : 0}
      </div>
    ),
    skeleton: () => <Skeleton className="w-8 h-6 rounded" />,
  },
];

const CompaniesTable: FC = () => {
  const { companies } = useCompanies();
  const router = useRouter();

  const onRowClick = (row: Company) => {
    router.push(AppRoutes.Company({ companyId: row.companyId }));
  };

  return (
    <DataTable
      columns={companyTableColumns}
      data={companies}
      onRowClick={onRowClick}
      searchable={true}
      rowIdKey="companyId"
    />
  );
};

export default CompaniesTable;
