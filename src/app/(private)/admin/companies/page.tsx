"use client";

import { useRouter } from "next/navigation";

import { TopBar } from "@/components/top-bar";
import { Building } from "lucide-react";

import { AddCompany } from "@/components/add-company";
import { useCompanyContext } from "@/hooks/context.hook";
import { Button } from "@/components/ui/button";

import { AppRoutes } from "@/lib/routes.app";

import { DataTable, ColumnDef } from "@/components/data-table";
import { Plus } from "lucide-react";

const columns: ColumnDef<Company>[] = [
  {
    id: "fullLegalName",
    label: "Company Name",
    value: (row) => row.fullLegalName,
    renderCell: (row) => <>{row.fullLegalName}</>,
    sortable: true,
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
  },
  {
    id: "shortName",
    renderCell: (row) => <>{row.shortName}</>,
    value: (row) => row.shortName,
    label: "Short Name",
    sortable: true,
  },
  {
    id: "address",
    label: "Address",
    renderCell: (row) => <>{row.address}</>,
  },
  {
    id: "primary",
    label: "Primary Contact",
    sortable: true,
    value: (row) =>
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
  },
];

export default function Companies() {
  const { companies } = useCompanyContext();
  const router = useRouter();

  const onRowClick = (row: Company) => {
    router.push(AppRoutes.AdminCompany({ companyId: row.id }));
  };

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
        <DataTable columns={columns} data={companies} onRowClick={onRowClick} />
      </div>
    </div>
  );
}
