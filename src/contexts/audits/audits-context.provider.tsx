"use client";

import {
  useState,
  createContext,
  useOptimistic,
  useTransition,
  useEffect,
} from "react";

import {
  AddAuditFormInputs,
  UpdateAuditFormInputs,
} from "@/schemas/audits.schema";
import {
  AddStakeholderFormInputs,
  UpdateStakeholderFormInputs,
} from "@/schemas/stakeholder.schema";
import {
  AddResourceFormInputs,
  UpdateResourceFormInputs,
} from "@/schemas/resource.schema";
import {
  AddScopeFormInputs,
  UpdateScopeFormInputs,
} from "@/schemas/scope.schema";

import { ServerActionResponse } from "@/types/types";
import {
  IAuditsContext,
  OptimisticAuditsAction,
  AuditAction,
} from "./audits-context.types";
import {
  addAudit,
  updateAudit,
  deleteAudit,
  addStakeholder,
} from "@/actions/audits";

import { cleanUndefinedFields } from "@/lib/utils";
import { useAlerts } from "@/state/alerts.state";

export const AuditsContext = createContext<IAuditsContext | null>(null);

export type AuditsContextProviderProps = {
  audits: Audit[];
  children: React.ReactNode;
};

export default function AuditsContextProvider({
  audits,
  children,
}: AuditsContextProviderProps) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
  const [optimisticAudits, setOptimisticAudits] = useOptimistic<
    Audit[],
    OptimisticAuditsAction
  >(audits, (state, { action, payload }) => {
    switch (action) {
      case AuditAction.UpdateAudit:
        return state.map((audit) =>
          audit.id === payload.auditId
            ? { ...audit, ...cleanUndefinedFields(payload.auditData) }
            : audit
        );
      // case AuditAction.DeleteAudit:
      //   return state.filter((audit) => audit.id !== payload.auditId);
      case AuditAction.UpdateStakeholder:
        return state.map((audit) => {
          const stakeholders = audit.stakeholders.map((stakeholder) =>
            stakeholder.id === payload.stakeholderId
              ? {
                  ...stakeholder,
                  ...cleanUndefinedFields(payload.stakeholderData),
                }
              : stakeholder
          );
          return { ...audit, stakeholders };
        });
      case AuditAction.DeleteStakeholder:
        return state.map((audit) => ({
          ...audit,
          stakeholders: audit.stakeholders.filter(
            (stakeholder) => stakeholder.id !== payload.stakeholderId
          ),
        }));
      case AuditAction.UpdateScope:
        return state.map((audit) => {
          const scopes = audit.scopes.map((scope) =>
            scope.id === payload.scopeId
              ? { ...scope, ...cleanUndefinedFields(payload.scopeData) }
              : scope
          );
          return { ...audit, scopes };
        });
      case AuditAction.DeleteScope:
        return state.map((audit) => ({
          ...audit,
          scopes: audit.scopes.filter((scope) => scope.id !== payload.scopeId),
        }));
      case AuditAction.UpdateResource:
        return state.map((audit) => {
          const resources = audit.resources.map((resource) =>
            resource.id === payload.resourceId
              ? { ...resource, ...cleanUndefinedFields(payload.resourceData) }
              : resource
          );
          return { ...audit, resources };
        });
      case AuditAction.DeleteResource:
        return state.map((audit) => ({
          ...audit,
          resources: audit.resources.filter(
            (resource) => resource.id !== payload.resourceId
          ),
        }));
      case AuditAction.addResourceToScope:
        return state.map((audit) => {
          const scopes = audit.scopes.map((scope) =>
            scope.id === payload.scopeId
              ? {
                  ...scope,
                  resources: [...scope.resources, payload.resource],
                }
              : scope
          );
          return { ...audit, scopes };
        });
      case AuditAction.removeResourceFromScope:
        return state.map((audit) => {
          const scopes = audit.scopes.map((scope) =>
            scope.id === payload.scopeId
              ? {
                  ...scope,
                  resources: scope.resources.filter(
                    (resource) => resource.id !== payload.resourceId
                  ),
                }
              : scope
          );
          return { ...audit, scopes };
        });
      default:
        return state;
    }
  });

  const handleAddAudit = async (
    auditData: AddAuditFormInputs
  ): Promise<ServerActionResponse<AddAuditFormInputs>> => {
    return await addAudit(auditData);
  };

  // const handleOptimiticUpdateAudit = async (inputs: {
  //   auditId: Audit["id"];
  //   auditData: UpdateAuditFormInputs;
  // }): Promise<void> =>
  //   startTransaction(async () => {
  //     setOptimisticAudits({
  //       action: AuditAction.UpdateAudit,
  //       payload: inputs,
  //     });

  //     const { success } = await updateAudit(inputs);
  //     if (!success)
  //       addAlert({
  //         title: "Failed to delete company.",
  //         text: "Rollingback changes. Please try again.",
  //         type: "error",
  //       });
  //   });

  const handleUpdateAudit = async (inputs: {
    auditId: Audit["id"];
    auditData: UpdateAuditFormInputs;
  }): Promise<ServerActionResponse<UpdateAuditFormInputs>> => {
    return await updateAudit(inputs);
  };

  const handleDeleteAudit = async (auditId: Audit["id"]) => {
    return await deleteAudit({ auditId });
  };

  const handleAddStakeholder = async (inputs: AddStakeholderFormInputs) => {
    return await addStakeholder(inputs);
  };

  return (
    <AuditsContext.Provider
      value={{
        audits: optimisticAudits,
        addAudit: handleAddAudit,
        updateAudit: handleUpdateAudit,
        deleteAudit: handleDeleteAudit,
        addStakeholder: handleAddStakeholder,
      }}
    >
      {children}
    </AuditsContext.Provider>
  );
}
