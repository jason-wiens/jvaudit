import { getAudit } from "./actions";

import { UpdateAuditFormInputs } from "@/schemas/audits.schema";
import {
  AddScopeFormInputs,
  UpdateScopeFormInputs,
} from "@/schemas/scope.schema";
import {
  AddResourceFormInputs,
  UpdateResourceFormInputs,
} from "@/schemas/resource.schema";
import { AddStakeholderFormInputs } from "@/schemas/stakeholder.schema";
import { ServerActionResponse } from "@/types/types";

export type Audit = NonNullable<Awaited<ReturnType<typeof getAudit>>>;
export type Stakeholder = Audit["stakeholders"][0];
export type Resource = Audit["resources"][0];
export type Scope = Audit["scopes"][0];
export type Company = Stakeholder["company"];
export type Employee = Resource["employee"];

export type IAuditContext = {
  audit: Audit | null;
  pending: boolean;
  updateAudit: (inputs: {
    auditId: Audit["auditId"];
    auditData: UpdateAuditFormInputs;
  }) => Promise<ServerActionResponse<UpdateAuditFormInputs>>;
  addStakeholder: (inputs: {
    stakeholderData: AddStakeholderFormInputs;
    company: Company;
  }) => Promise<void>;
  deleteStakeholder: (
    stakeholderId: Stakeholder["stakeholderId"]
  ) => Promise<void>;
  addResource: (inputs: {
    resourceData: AddResourceFormInputs;
    employee: Employee;
  }) => Promise<void>;
  updateResource: (inputs: {
    resourceId: Resource["resourceId"];
    resourceData: UpdateResourceFormInputs;
  }) => Promise<void>;
  deleteResource: (resourceId: Resource["resourceId"]) => Promise<void>;
  addScope: (inputs: AddScopeFormInputs) => Promise<void>;
  updateScope: (inputs: {
    scopeId: Scope["scopeId"];
    scopeData: UpdateScopeFormInputs;
  }) => Promise<void>;
  deleteScope: (scopeId: Scope["scopeId"]) => Promise<void>;
};

export enum AuditAction {
  UpdateAudit = "update:audit",
  AddStakeholder = "add:stakeholder",
  DeleteStakeholder = "delete:stakeholder",
  AddResource = "add:resource",
  UpdateResource = "update:resource",
  DeleteResource = "delete:resource",
  AddScope = "add:scope",
  UpdateScope = "update:scope",
  DeleteScope = "delete:scope",
}

type OptimisticUpdateAudit = {
  action: AuditAction.UpdateAudit;
  payload: {
    auditData: UpdateAuditFormInputs;
  };
};

type OptimisticAddStakeholder = {
  action: AuditAction.AddStakeholder;
  payload: {
    stakeholder: Stakeholder;
  };
};

type OptimisticDeleteStakeholder = {
  action: AuditAction.DeleteStakeholder;
  payload: {
    stakeholderId: Stakeholder["stakeholderId"];
  };
};

type OptimisticAddResource = {
  action: AuditAction.AddResource;
  payload: {
    resource: Resource;
  };
};

type OptimisticUpdateResource = {
  action: AuditAction.UpdateResource;
  payload: {
    resourceId: Resource["resourceId"];
    resourceData: UpdateResourceFormInputs;
  };
};

type OptimisticDeleteResource = {
  action: AuditAction.DeleteResource;
  payload: {
    resourceId: Resource["resourceId"];
  };
};

type OptimisticAddScope = {
  action: AuditAction.AddScope;
  payload: {
    scope: Scope;
  };
};

type OptimisticUpdateScope = {
  action: AuditAction.UpdateScope;
  payload: {
    scopeId: Scope["scopeId"];
    scopeData: UpdateScopeFormInputs;
  };
};

type OptimisticDeleteScope = {
  action: AuditAction.DeleteScope;
  payload: {
    scopeId: Scope["scopeId"];
  };
};

export type OptimisticAuditAction =
  | OptimisticUpdateAudit
  | OptimisticAddStakeholder
  | OptimisticDeleteStakeholder
  | OptimisticAddResource
  | OptimisticUpdateResource
  | OptimisticDeleteResource
  | OptimisticAddScope
  | OptimisticUpdateScope
  | OptimisticDeleteScope;
