"use client";

import React from "react";
import { Employee } from "./select-employee.types";

import { DataTable } from "@/components/data-table";
import { selectEmployeeColumns } from "./select-employee.table";
import { Button } from "@/components/ui/button";

type SelectEmployeeProps = {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
  onCancel?: () => void;
};

const SelectEmployee: React.FC<SelectEmployeeProps> = ({
  employees,
  onSelect,
  onCancel,
}) => {
  return (
    <DataTable
      columns={selectEmployeeColumns}
      data={employees}
      searchable={true}
      onRowClick={(row) => onSelect(row)}
      maxHeight={300}
    >
      <div className="flex items-center gap-2">
        <Button variant="cancel" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </DataTable>
  );
};

export default SelectEmployee;
