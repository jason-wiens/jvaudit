import { getCompanies } from "./actions/get-companies";

export type Company = Awaited<ReturnType<typeof getCompanies>>[0];
export type Employee = Company["employees"][0];

import { ServerActionResponse } from "@/types/types";
import { AddCompanyFormInputs } from "@/schemas/company.schema";
import { AddPersonFormInputs } from "@/schemas/person.schema";
import { AddEmployeeFormInputs } from "@/schemas/employee.schema";

export type AddCompanyInputs = AddCompanyFormInputs &
  AddEmployeeFormInputs &
  AddPersonFormInputs;

export type ICompaniesContext = {
  companies: Company[];
  addCompany: (
    companyData: AddCompanyInputs
  ) => Promise<ServerActionResponse<AddCompanyInputs>>;
  deleteCompany: (inputs: {
    companyId: string;
  }) => Promise<ServerActionResponse>;
};
