import { ColumnDef } from "@/components/data-table";
import { Employee } from "./select-employee.types";

export const selectEmployeeColumns: ColumnDef<Employee>[] = [
  {
    id: "firstName",
    label: "First Name",
    sortableValue: (row) => row.personalProfile.firstName,
    searchableValue: (row) => row.personalProfile.firstName,
    renderCell: (row) => <>{row.personalProfile.firstName}</>,
  },
  {
    id: "lastName",
    label: "Last Name",
    renderCell: (row) => <>{row.personalProfile.lastName}</>,
    sortableValue: (row) => row.personalProfile.lastName,
    searchableValue: (row) => row.personalProfile.lastName,
  },
  {
    id: "email",
    label: "Email",
    sortableValue: (row) => row.personalProfile.email,
    searchableValue: (row) => row.personalProfile.email,
    renderCell: (row) => <>{row.personalProfile.email}</>,
  },
];
