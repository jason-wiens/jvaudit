import { ServerActionResponse } from "@/types/types";
import {
  AddCompanyFormInputs,
  UpdateCompanyFormInputs,
} from "@/schemas/company.schema";
import {
  AddPersonFormInputs,
  UpdatePersonFormInputs,
} from "@/schemas/person.schema";
import {
  AddEmployeeFormInputs,
  UpdateEmployeeFormInputs,
} from "@/schemas/employee.schema";

export type AddCompanyInputs = AddCompanyFormInputs &
  AddEmployeeFormInputs &
  AddPersonFormInputs;

export type ICompanyContext = {
  companies: Company[];
  updateCompany: (inputs: {
    companyId: string;
    companyData: UpdateCompanyFormInputs;
  }) => Promise<ServerActionResponse<UpdateCompanyFormInputs>>;
  addCompany: (
    companyData: AddCompanyInputs
  ) => Promise<ServerActionResponse<AddCompanyInputs>>;
  deleteCompany: (companyId: string) => Promise<void>;
  addEmployee: (inputs: {
    companyId: string;
    employeeData: AddPersonFormInputs & AddEmployeeFormInputs;
  }) => Promise<
    ServerActionResponse<AddPersonFormInputs & AddEmployeeFormInputs>
  >;
  updateEmployee: (inputs: {
    companyId: string;
    employeeId: string;
    employeeData: UpdatePersonFormInputs & UpdateEmployeeFormInputs;
  }) => Promise<void>;
  deleteEmployee: (inputs: {
    employeeId: string;
    companyId: string;
  }) => Promise<void>;
  changePrimaryContact: (
    companyId: string,
    primaryContact: CompanyEmployee
  ) => Promise<void>;
};

export type OptimisticDeleteCompany = {
  action: "delete:company";
  payload: {
    companyId: Company["id"];
  };
};

export type OptimisticUpdateEmployee = {
  action: "update:employee";
  payload: {
    companyId: Company["id"];
    employeeId: Employee["id"];
    employeeData: UpdateEmployeeFormInputs & UpdatePersonFormInputs;
  };
};

export type OptimisticChangePrimaryContact = {
  action: "update:primaryContact";
  payload: {
    companyId: string;
    employeeId: Employee["id"];
  };
};

export type OptimisticDeleteEmployee = {
  action: "delete:employee";
  payload: {
    companyId: Company["id"];
    employeeId: Employee["id"];
  };
};

export type OptimisticCompanyAction =
  | OptimisticUpdateEmployee
  | OptimisticChangePrimaryContact
  | OptimisticDeleteEmployee
  | OptimisticDeleteCompany;
