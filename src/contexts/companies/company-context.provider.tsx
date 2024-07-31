"use client";

import {
  useState,
  createContext,
  useOptimistic,
  useTransition,
  useEffect,
} from "react";
import { updateCompany, deleteCompany, addCompany } from "@/actions/companies";
import {
  updateEmployee,
  deleteEmployee,
  addEmployee,
  changePrimaryContact,
} from "@/actions/employees";
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

import { ServerActionResponse } from "@/types/types";
import {
  ICompanyContext,
  OptimisticCompanyAction,
  AddCompanyInputs,
} from "./company-context.types";

import { cleanUndefinedFields } from "@/lib/utils";
import { useAlerts } from "@/state/alerts.state";

export const CompanyContext = createContext<ICompanyContext | null>(null);

export type CompanyContextProviderProps = {
  companies: Company[];
  children: React.ReactNode;
};

export default function CompanyContextProvider({
  companies,
  children,
}: CompanyContextProviderProps) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
  const [optimisticCompanies, setOptimisticCompanies] = useOptimistic<
    Company[],
    OptimisticCompanyAction
  >(companies, (state, { action, payload }) => {
    switch (action) {
      // case "deleteCompany":
      //   return state.filter((company) => company.id !== payload);
      case "update:primaryContact":
        return state.map((company) => {
          if (company.id === payload.companyId) {
            company.employees.map((e) => {
              e.primaryContact = e.id === payload.employeeId ? true : false;
            });
          }
          return company;
        });
      case "update:employee":
        return state.map((company) => {
          if (company.id === payload.companyId) {
            company.employees.map((e) => ({
              ...e,
              ...cleanUndefinedFields(payload.employeeData),
            }));
          }
          return company;
        });
      case "delete:employee":
        return state.map((company) => {
          if (company.id === payload.companyId) {
            company.employees.filter((e) => e.id !== payload.employeeId);
          }
          return company;
        });
      case "delete:company":
        return state.filter((company) => company.id !== payload.companyId);
      default:
        return state;
    }
  });

  const handleUpdateCompany = async (inputs: {
    companyId: string;
    companyData: UpdateCompanyFormInputs;
  }): Promise<ServerActionResponse<UpdateCompanyFormInputs, void>> => {
    return await updateCompany(inputs);
  };

  const handleAddCompany = async (
    companyData: AddCompanyFormInputs &
      AddPersonFormInputs &
      AddEmployeeFormInputs
  ): Promise<ServerActionResponse<AddCompanyInputs>> => {
    return await addCompany(companyData);
  };

  const handleOptimisticDeleteCompany = async (companyId: string) =>
    startTransaction(async () => {
      setOptimisticCompanies({
        action: "delete:company",
        payload: { companyId },
      });

      const { success } = await deleteCompany({ companyId });
      if (!success)
        addAlert({
          title: "Failed to delete company.",
          text: "Rollingback changes. Please try again.",
          type: "error",
        });
    });

  const handleAddEmployee = async (inputs: {
    companyId: string;
    employeeData: AddPersonFormInputs & AddEmployeeFormInputs;
  }) => {
    const { companyId, employeeData } = inputs;
    return await addEmployee({ ...employeeData, companyId });
  };

  const handleOptimisticDeleteEmployee = async (inputs: {
    companyId: string;
    employeeId: string;
  }) =>
    startTransaction(async () => {
      const { companyId, employeeId } = inputs;
      setOptimisticCompanies({
        action: "delete:employee",
        payload: { companyId, employeeId },
      });

      const { success } = await deleteEmployee(employeeId);
      if (!success)
        addAlert({
          title: "Failed to delete employee.",
          text: "Rollingback changes. Please try again.",
          type: "error",
        });
    });

  const handleOIptimisticUpdateEmployee = async (inputs: {
    employeeId: string;
    companyId: string;
    employeeData: UpdatePersonFormInputs & UpdateEmployeeFormInputs;
  }) => {
    const { employeeId, employeeData, companyId } = inputs;
    setOptimisticCompanies({
      action: "update:employee",
      payload: { employeeId, companyId, employeeData },
    });

    const { success } = await updateEmployee(employeeId, employeeData);
    if (!success)
      addAlert({
        title: "Failed to update employee.",
        text: "Rollingback changes. Please try again.",
        type: "error",
      });
  };

  const handleOptimisticChangePrimaryContact = async (
    companyId: string,
    primaryContact: CompanyEmployee
  ) =>
    startTransaction(async () => {
      const { id: employeeId } = primaryContact;
      setOptimisticCompanies({
        action: "update:primaryContact",
        payload: { companyId, employeeId },
      });
      const { success } = await changePrimaryContact({ companyId, employeeId });
      if (!success)
        addAlert({
          title: "Failed to change primary contact",
          text: "Rollingback changes. Please try again.",
          type: "error",
        });
    });

  return (
    <CompanyContext.Provider
      value={{
        companies: optimisticCompanies,
        updateCompany: handleUpdateCompany,
        addCompany: handleAddCompany,
        deleteCompany: handleOptimisticDeleteCompany,
        addEmployee: handleAddEmployee,
        updateEmployee: handleOIptimisticUpdateEmployee,
        deleteEmployee: handleOptimisticDeleteEmployee,
        changePrimaryContact: handleOptimisticChangePrimaryContact,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
