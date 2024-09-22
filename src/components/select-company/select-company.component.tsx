"use client";

import React from "react";
import { useCompanies } from "@/state";

import { DataTable } from "@/components/data-table";
import { selectCompanyColumns } from "./select-company.table";
import { AddCompany } from "@/components/add-company";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Company } from "./select-company.types";

type SelectCompanyProps = {
  onSelect: (company: Company) => void;
  onCancel?: () => void;
};

const SelectCompany: React.FC<SelectCompanyProps> = ({
  onSelect,
  onCancel,
}) => {
  const { companies } = useCompanies();

  return (
    <DataTable
      columns={selectCompanyColumns}
      data={companies}
      searchable={true}
      onRowClick={(row) => onSelect(row)}
      maxHeight={300}
    >
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <AddCompany>
          <Button variant="add" size="sm">
            Add Company <Plus size={16} className="ml-2" />
          </Button>
        </AddCompany>
      </div>
    </DataTable>
  );
};

export default SelectCompany;
