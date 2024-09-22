import { ColumnDef } from "@/components/data-table";
import { AddCompany } from "@/components/add-company";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Company } from "./select-company.types";

export const selectCompanyColumns: ColumnDef<Company>[] = [
  {
    id: "fullLegalName",
    label: "Company Name",
    sortableValue: (row) => row.fullLegalName,
    searchableValue: (row) => row.fullLegalName,
    renderCell: (row) => <>{row.fullLegalName}</>,
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
    sortableValue: (row) => row.shortName,
    searchableValue: (row) => row.shortName,
    label: "Short Name",
  },
  {
    id: "primary",
    label: "Primary Contact",
    sortableValue: (row) =>
      row.employees.find((e) => e.primaryContact)?.personalProfile.lastName ||
      "zzzzz",
    searchableValue: (row) =>
      row.employees.find((e) => e.primaryContact)?.personalProfile.lastName ||
      "",
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
];
