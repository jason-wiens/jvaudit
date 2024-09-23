"use client";

import { createContext, useOptimistic, useTransition } from "react";
import {
  updateAudit,
  addStakeholder,
  deleteStakeholder,
  addResource,
  updateResource,
  deleteResource,
  addScope,
  updateScope,
  deleteScope,
} from "./actions";

import { UpdateAuditFormInputs } from "@/schemas/audits.schema";
import { AddStakeholderFormInputs } from "@/schemas/stakeholder.schema";
import {
  AddResourceFormInputs,
  UpdateResourceFormInputs,
} from "@/schemas/resource.schema";
import {
  AddScopeFormInputs,
  UpdateScopeFormInputs,
} from "@/schemas/scope.schema";

import {
  IAuditContext,
  OptimisticAuditAction,
  AuditAction,
  Audit,
  Stakeholder,
  Resource,
  Scope,
  Company,
} from "./types";

import { useAlerts } from "@/state";

type AuditContextProviderProps = {
  children: React.ReactNode;
  audit: Audit;
};

export const AuditContext = createContext<IAuditContext | null>(null);

export function AdminAuditContextProvider({
  children,
  audit,
}: AuditContextProviderProps) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
  const [optimisticAudit, setOptimisticAudit] = useOptimistic<
    Audit,
    OptimisticAuditAction
  >(audit, (state, { action, payload }) => {
    switch (action) {
      case AuditAction.UpdateAudit:
        return {
          ...state,
          ...payload.auditData,
        };
      case AuditAction.AddStakeholder:
        return {
          ...state,
          stakeholders: [...state.stakeholders, payload.stakeholder],
        };
      case AuditAction.DeleteStakeholder:
        return {
          ...state,
          stakeholders: state.stakeholders.filter(
            (s) => s.stakeholderId !== payload.stakeholderId
          ),
        };
      case AuditAction.AddResource:
        return {
          ...state,
          resources: [...state.resources, payload.resource],
        };
      case AuditAction.UpdateResource:
        return {
          ...state,
          resources: state.resources.map((r) =>
            r.resourceId === payload.resourceId
              ? { ...r, ...payload.resourceData }
              : r
          ),
        };
      case AuditAction.DeleteResource:
        return {
          ...state,
          resources: state.resources.filter(
            (r) => r.resourceId !== payload.resourceId
          ),
        };
      case AuditAction.AddScope:
        return {
          ...state,
          scopes: [...state.scopes, payload.scope],
        };
      case AuditAction.UpdateScope:
        return {
          ...state,
          scopes: state.scopes.map((s) =>
            s.scopeId === payload.scopeId ? { ...s, ...payload.scopeData } : s
          ),
        };
      case AuditAction.DeleteScope:
        return {
          ...state,
          scopes: state.scopes.filter((s) => s.scopeId !== payload.scopeId),
        };
      default:
        return state;
    }
  });

  const optimisticUpdateAudit = async (inputs: {
    auditId: string;
    auditData: UpdateAuditFormInputs;
  }) =>
    startTransaction(async () => {
      setOptimisticAudit({
        action: AuditAction.UpdateAudit,
        payload: inputs,
      });

      const { success, message, formErrors } = await updateAudit(inputs);

      if (!success) {
        addAlert({
          title: "Failed to update audit",
          message: message || "Please try again",
          type: "error",
        });
        if (formErrors) {
          console.error(formErrors);
        }
      }
    });

  const optimisticAddStakeholder = async (inputs: {
    stakeholderData: AddStakeholderFormInputs;
    company: Company;
  }) =>
    startTransaction(async () => {
      const { stakeholderData, company } = inputs;

      setOptimisticAudit({
        action: AuditAction.AddStakeholder,
        payload: {
          stakeholder: {
            ...stakeholderData,
            company,
          } as Stakeholder,
        },
      });

      const { success, message } = await addStakeholder(stakeholderData);

      if (!success) {
        addAlert({
          title: "Failed to add stakeholder",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  const optimisticDeleteStakeholder = async (
    stakeholderId: Stakeholder["stakeholderId"]
  ) =>
    startTransaction(async () => {
      setOptimisticAudit({
        action: AuditAction.DeleteStakeholder,
        payload: { stakeholderId },
      });

      const { success, message } = await deleteStakeholder({ stakeholderId });

      if (!success) {
        addAlert({
          title: "Failed to delete stakeholder",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  const optimisticAddResource = async (inputs: {
    resourceData: AddResourceFormInputs;
    employee: Resource["employee"];
  }) =>
    startTransaction(async () => {
      const { resourceData, employee } = inputs;

      setOptimisticAudit({
        action: AuditAction.AddResource,
        payload: {
          resource: {
            ...resourceData,
            employee,
          } as Resource,
        },
      });

      const { success, message } = await addResource(resourceData);

      if (!success) {
        addAlert({
          title: "Failed to add resource",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  const optimisticUpdateResource = async (inputs: {
    resourceId: Resource["resourceId"];
    resourceData: UpdateResourceFormInputs;
  }) =>
    startTransaction(async () => {
      const { resourceId, resourceData } = inputs;

      setOptimisticAudit({
        action: AuditAction.UpdateResource,
        payload: {
          resourceId,
          resourceData,
        },
      });

      const { success, message } = await updateResource({
        resourceId,
        resourceData,
      });

      if (!success) {
        addAlert({
          title: "Failed to update resource",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  const optimisticDeleteResource = async (resourceId: Resource["resourceId"]) =>
    startTransaction(async () => {
      setOptimisticAudit({
        action: AuditAction.DeleteResource,
        payload: { resourceId },
      });

      const { success, message } = await deleteResource({ resourceId });

      if (!success) {
        addAlert({
          title: "Failed to delete resource",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  const optimisticAddScope = async (inputs: AddScopeFormInputs) =>
    startTransaction(async () => {
      setOptimisticAudit({
        action: AuditAction.AddScope,
        payload: {
          scope: {
            ...inputs,
          } as Scope,
        },
      });

      const { success, message } = await addScope(inputs);

      if (!success) {
        addAlert({
          title: "Failed to add scope",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  const optimisticUpdateScope = async (inputs: {
    scopeId: Scope["scopeId"];
    scopeData: UpdateScopeFormInputs;
  }) =>
    startTransaction(async () => {
      const { scopeId, scopeData } = inputs;

      setOptimisticAudit({
        action: AuditAction.UpdateScope,
        payload: {
          scopeId,
          scopeData,
        },
      });

      const { success, message } = await updateScope({ scopeId, scopeData });

      if (!success) {
        addAlert({
          title: "Failed to update scope",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  const optimisticDeleteScope = async (scopeId: Scope["scopeId"]) =>
    startTransaction(async () => {
      setOptimisticAudit({
        action: AuditAction.DeleteScope,
        payload: { scopeId },
      });

      const { success, message } = await deleteScope({ scopeId });

      if (!success) {
        addAlert({
          title: "Failed to delete scope",
          message: message || "Please try again",
          type: "error",
        });
      }
    });

  return (
    <AuditContext.Provider
      value={{
        audit: optimisticAudit,
        pending,
        updateAudit,
        addStakeholder: optimisticAddStakeholder,
        deleteStakeholder: optimisticDeleteStakeholder,
        addResource: optimisticAddResource,
        updateResource: optimisticUpdateResource,
        deleteResource: optimisticDeleteResource,
        addScope: optimisticAddScope,
        updateScope: optimisticUpdateScope,
        deleteScope: optimisticDeleteScope,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}
