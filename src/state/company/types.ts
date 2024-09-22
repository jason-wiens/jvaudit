import { getCompanies } from "../companies/actions/get-companies";

export type Company = NonNullable<Awaited<ReturnType<typeof getCompanies>>>[0];
export type Employee = Company["employees"][0];

import { ServerActionResponse } from "@/types/types";
import { UpdateCompanyFormInputs } from "@/schemas/company.schema";
import {
  AddPersonFormInputs,
  UpdatePersonFormInputs,
} from "@/schemas/person.schema";
import {
  AddEmployeeFormInputs,
  UpdateEmployeeFormInputs,
} from "@/schemas/employee.schema";

export type ICompanyContext = {
  company: Company | null;
  updateCompany: (inputs: {
    companyId: string;
    companyData: UpdateCompanyFormInputs;
  }) => Promise<ServerActionResponse<UpdateCompanyFormInputs>>;
  addEmployee: (inputs: {
    companyId: string;
    employeeData: AddPersonFormInputs & AddEmployeeFormInputs;
  }) => Promise<
    ServerActionResponse<AddPersonFormInputs & AddEmployeeFormInputs>
  >;
  updateEmployee: (inputs: {
    employeeId: string;
    employeeData: UpdatePersonFormInputs & UpdateEmployeeFormInputs;
  }) => Promise<
    ServerActionResponse<UpdatePersonFormInputs & UpdateEmployeeFormInputs>
  >;
  deleteEmployee: (employeeId: string) => Promise<void>;
  changePrimaryContact: (primaryContact: Employee) => Promise<void>;
};

export type OptimisticUpdateEmployee = {
  action: "update:employee";
  payload: {
    employeeId: Employee["companyId"];
    employeeData: UpdateEmployeeFormInputs & UpdatePersonFormInputs;
  };
};

export type OptimisticChangePrimaryContact = {
  action: "update:primaryContact";
  payload: {
    employeeId: Employee["companyId"];
  };
};

export type OptimisticDeleteEmployee = {
  action: "delete:employee";
  payload: {
    employeeId: Employee["companyId"];
  };
};

export type OptimisticCompanyAction =
  | OptimisticUpdateEmployee
  | OptimisticChangePrimaryContact
  | OptimisticDeleteEmployee;
