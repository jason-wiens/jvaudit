import { ColumnDef } from "@/components/data-table";
import { Employee } from "@/state/company/types";
import { AddEmployee } from "@/components/add-employee";
import { Button } from "@/components/ui/button";
import { EmployeeDropDownMenu } from "@/components/drop-down-menus/employee";
import { Plus, Ellipsis } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const employeeColumns: ColumnDef<Omit<Employee, "employerProfile">>[] = [
  {
    id: "firstName",
    label: "First Name",
    renderFooter: () => (
      <div className="py-2">
        <AddEmployee>
          <Button variant="ghost" size="sm">
            <Plus size={16} className="mr-2" />
            Add Employee
          </Button>
        </AddEmployee>
      </div>
    ),
    sortableValue: (row) => row.personalProfile.firstName,
    renderCell: (row) => <>{row.personalProfile.firstName}</>,
    skeleton: () => <Skeleton className="h-4 w-24" />,
  },
  {
    id: "lastName",
    label: "Last Name",
    sortableValue: (row) => row.personalProfile.lastName,
    renderCell: (row) => <>{row.personalProfile.lastName}</>,
    skeleton: () => <Skeleton className="h-4 w-24" />,
  },
  {
    id: "email",
    label: "Email",
    sortableValue: (row) => row.personalProfile.email,
    renderCell: (row) => <>{row.personalProfile.email}</>,
    skeleton: () => <Skeleton className="h-4 w-24" />,
  },
  {
    id: "position",
    label: "Position",
    sortableValue: (row) => row.position || "",
    renderCell: (row) => <>{row.position}</>,
    skeleton: () => <Skeleton className="h-4 w-24" />,
  },
  {
    id: "primaryContact",
    label: "Primary Contact",
    align: "center",
    renderCell: (row) =>
      row.primaryContact ? (
        <div className="w-full flex justify-center">
          <Badge variant="green">Primary</Badge>
        </div>
      ) : null,
  },
  {
    id: "edit",
    label: "",
    align: "center",
    renderCell: (row) => <EmployeeDropDownMenu employee={row} />,
    skeleton: () => <Ellipsis />,
  },
];
