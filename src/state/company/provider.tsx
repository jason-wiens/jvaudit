"use client";

import { createContext, useOptimistic, useTransition } from "react";
import {
  updateCompany,
  updateEmployee,
  deleteEmployee,
  addEmployee,
  changePrimaryContact,
} from "./actions";
import {
  AddPersonFormInputs,
  UpdatePersonFormInputs,
} from "@/schemas/person.schema";
import {
  AddEmployeeFormInputs,
  UpdateEmployeeFormInputs,
} from "@/schemas/employee.schema";

import {
  ICompanyContext,
  OptimisticCompanyAction,
  Company,
  Employee,
} from "./types";

import { cleanUndefinedFields } from "@/lib/utils";
import { useAlerts } from "@/state";

export const CompanyContext = createContext<ICompanyContext | null>(null);

export type CompanyContextProviderProps = {
  children: React.ReactNode;
  company: Company | null;
};

export function CompanyContextProvider({
  children,
  company,
}: CompanyContextProviderProps) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
  const [optimisticCompany, setOptimisticCompany] = useOptimistic<
    Company | null,
    OptimisticCompanyAction
  >(company, (state, { action, payload }) => {
    if (!state) return null;

    switch (action) {
      case "update:primaryContact":
        return {
          ...state,
          employees: state.employees.map((e) => ({
            ...e,
            primaryContact: e.employeeId === payload.employeeId ? true : false,
          })),
        };
      case "update:employee":
        return {
          ...state,
          employees: state.employees.map((e) => {
            if (e.employeeId === payload.employeeId) {
              const personalProfile: UpdatePersonFormInputs = {
                firstName: payload.employeeData.firstName,
                lastName: payload.employeeData.lastName,
                email: payload.employeeData.email,
              };
              const employeeData: UpdateEmployeeFormInputs = {
                position: payload.employeeData.position,
                primaryContact: payload.employeeData.primaryContact,
              };
              return {
                ...e,
                ...cleanUndefinedFields(employeeData),
                personalProfile: {
                  ...e.personalProfile,
                  ...cleanUndefinedFields(personalProfile),
                },
              };
            }
            return e;
          }),
        };
      case "delete:employee":
        return {
          ...state,
          employees: state.employees.filter(
            (e) => e.employeeId !== payload.employeeId
          ),
        };
      default:
        return state;
    }
  });

  const handleAddEmployee = async (inputs: {
    companyId: string;
    employeeData: AddPersonFormInputs & AddEmployeeFormInputs;
  }) => {
    const { companyId, employeeData } = inputs;
    return await addEmployee({ ...employeeData, companyId });
  };

  const handleOptimisticDeleteEmployee = async (employeeId: string) =>
    startTransaction(async () => {
      setOptimisticCompany({
        action: "delete:employee",
        payload: { employeeId },
      });

      const { success } = await deleteEmployee(employeeId);
      if (!success)
        addAlert({
          title: "Failed to delete employee.",
          message: "Rollingback changes. Please try again.",
          type: "error",
        });
    });

  const handleOIptimisticUpdateEmployee = async (inputs: {
    employeeId: string;
    employeeData: UpdatePersonFormInputs & UpdateEmployeeFormInputs;
  }) =>
    startTransaction(async () => {
      const { employeeId, employeeData } = inputs;
      setOptimisticCompany({
        action: "update:employee",
        payload: { employeeId, employeeData },
      });

      const { success } = await updateEmployee(inputs);
      if (!success)
        addAlert({
          title: "Failed to update employee.",
          message: "Rollingback changes. Please try again.",
          type: "error",
        });
    });

  const handleOptimisticChangePrimaryContact = async (
    primaryContact: Employee
  ) =>
    startTransaction(async () => {
      if (!optimisticCompany) return;
      const { employeeId } = primaryContact;
      setOptimisticCompany({
        action: "update:primaryContact",
        payload: { employeeId },
      });
      const { success } = await changePrimaryContact({
        companyId: optimisticCompany.companyId,
        employeeId,
      });
      if (!success)
        addAlert({
          title: "Failed to change primary contact",
          message: "Rollingback changes. Please try again.",
          type: "error",
        });
    });

  return (
    <CompanyContext.Provider
      value={{
        company: optimisticCompany,
        updateCompany,
        addEmployee: handleAddEmployee,
        updateEmployee,
        deleteEmployee: handleOptimisticDeleteEmployee,
        changePrimaryContact: handleOptimisticChangePrimaryContact,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
