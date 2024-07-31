import { ColumnDef } from "@/components/data-table";
import { AddEmployee } from "@/components/add-employee";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Ellipsis,
  UserCog,
  Trash,
  ArrowBigUpDash,
  Settings,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EmployeeColumnProps = {
  companyId: string;
  handleEditEmployee: (row: Omit<Employee, "employerProfile">) => Promise<void>;
  handleDeleteEmployee: (
    row: Omit<Employee, "employerProfile">
  ) => Promise<void>;
  handleChangingPrimary: (
    row: Omit<Employee, "employerProfile">
  ) => Promise<void>;
};

export const employeeColumns = ({
  companyId,
  handleEditEmployee,
  handleDeleteEmployee,
  handleChangingPrimary,
}: EmployeeColumnProps): ColumnDef<Omit<Employee, "employerProfile">>[] => {
  const colums: ColumnDef<Omit<Employee, "employerProfile">>[] = [
    {
      id: "firstName",
      label: "First Name",
      sortable: true,
      renderFooter: () => (
        <div className="py-2">
          <AddEmployee companyId={companyId}>
            <Button variant="ghost" size="sm">
              <Plus size={16} className="mr-2" />
              Add Employee
            </Button>
          </AddEmployee>
        </div>
      ),
      value: (row) => row.personalProfile.firstName,
      renderCell: (row) => <>{row.personalProfile.firstName}</>,
      skeleton: () => <Skeleton className="h-4 w-24" />,
    },
    {
      id: "lastName",
      label: "Last Name",
      value: (row) => row.personalProfile.lastName,
      renderCell: (row) => <>{row.personalProfile.lastName}</>,
      sortable: true,
      skeleton: () => <Skeleton className="h-4 w-24" />,
    },
    {
      id: "email",
      label: "Email",
      value: (row) => row.personalProfile.email,
      renderCell: (row) => <>{row.personalProfile.email}</>,
      sortable: true,
      skeleton: () => <Skeleton className="h-4 w-24" />,
    },
    {
      id: "position",
      label: "Position",
      value: (row) => row.position || "",
      renderCell: (row) => <>{row.position}</>,
      sortable: true,
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
      renderCell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis className="text-zinc-500 hover:text-zinc-950 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="flex items-center gap-2">
              <UserCog size={12} strokeWidth={3} />
              {`${row.personalProfile.firstName} ${row.personalProfile.lastName}`}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2"
              onClick={() => handleEditEmployee(row)}
            >
              <Settings size={12} strokeWidth={2} />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => handleChangingPrimary(row)}
            >
              <ArrowBigUpDash size={12} strokeWidth={2} />
              Make Primary Contact
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-500 hover:text-red-500 cursor-pointer"
              onClick={() => handleDeleteEmployee(row)}
            >
              <Trash size={12} strokeWidth={2} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      skeleton: () => <Ellipsis />,
    },
  ];

  return colums;
};
