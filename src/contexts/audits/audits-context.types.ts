import { ServerActionResponse } from "@/types/types";
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

export type IAuditsContext = {
  audits: Audit[];
  addAudit: (
    auditData: AddAuditFormInputs
  ) => Promise<ServerActionResponse<AddAuditFormInputs>>;
  updateAudit: (inputs: {
    auditId: Audit["id"];
    auditData: UpdateAuditFormInputs;
  }) => Promise<ServerActionResponse<UpdateAuditFormInputs>>;
  deleteAudit: (auditId: Audit["id"]) => Promise<ServerActionResponse>;
  addStakeholder: (
    inputs: AddStakeholderFormInputs
  ) => Promise<ServerActionResponse<AddStakeholderFormInputs>>;
  // updateStakeholder: (inputs: {
  //   auditId: Audit["id"];
  //   stakeholderId: Stakeholder["id"];
  //   stakeholderData: UpdateStakeholderFormInputs;
  // }) => Promise<void>;
  // removeStakeholder: (stakeholderId: Stakeholder["id"]) => Promise<void>;
  // addAuditScope: (inputs: {
  //   auditId: Audit["id"];
  //   scopeData: AddScopeFormInputs;
  // }) => Promise<ServerActionResponse<AddScopeFormInputs>>;
  // updateAuditSope: (inputs: {
  //   auditId: Audit["id"];
  //   scopeId: Scope["id"];
  //   scopeData: UpdateScopeFormInputs;
  // }) => Promise<void>;
  // removeAuditScope: (scopeId: Scope["id"]) => Promise<void>;
  // addResource: (inputs: {
  //   auditId: Audit["id"];
  //   resourceData: AddResourceFormInputs;
  // }) => Promise<ServerActionResponse<AddResourceFormInputs>>;
  // updateResource: (inputs: {
  //   auditId: Audit["id"];
  //   resourceId: Resource["id"];
  //   resourceData: UpdateResourceFormInputs;
  // }) => Promise<void>;
  // removeResource: (resourceId: Resource["id"]) => Promise<void>;
  // addResourceToScope: (inputs: {
  //   resourceId: Resource["id"];
  //   scopeId: Scope["id"];
  // }) => Promise<void>;
  // removeResourceFromScope: (inputs: {
  //   resourceId: Resource["id"];
  //   scopeId: Scope["id"];
  // }) => Promise<void>;
};

export enum AuditAction {
  UpdateAudit = "update:audit",
  DeleteAudit = "delete:audit",
  UpdateStakeholder = "update:stakeholder",
  DeleteStakeholder = "delete:stakeholder",
  UpdateScope = "update:scope",
  DeleteScope = "delete:scope",
  UpdateResource = "update:resource",
  DeleteResource = "delete:resource",
  addResourceToScope = "add:resourceToScope",
  removeResourceFromScope = "remove:resourceFromScope",
}

export type OptimisticAuditUpdate = {
  action: AuditAction.UpdateAudit;
  payload: {
    auditId: Audit["id"];
    auditData: UpdateAuditFormInputs;
  };
};

// export type OptimisticDeleteAudit = {
//   action: AuditAction.DeleteAudit;
//   payload: {
//     auditId: Audit["id"];
//   };
// };

export type OptimisticStakeholderUpdate = {
  action: AuditAction.UpdateStakeholder;
  payload: {
    auditId: Audit["id"];
    stakeholderId: Stakeholder["id"];
    stakeholderData: UpdateStakeholderFormInputs;
  };
};

export type OptimisticDeleteStakeholder = {
  action: AuditAction.DeleteStakeholder;
  payload: {
    stakeholderId: Stakeholder["id"];
  };
};

export type OptimisticScopeUpdate = {
  action: AuditAction.UpdateScope;
  payload: {
    auditId: Audit["id"];
    scopeId: Scope["id"];
    scopeData: UpdateScopeFormInputs;
  };
};

export type OptimisticDeleteScope = {
  action: AuditAction.DeleteScope;
  payload: {
    scopeId: Scope["id"];
  };
};

export type OptimisticResourceUpdate = {
  action: AuditAction.UpdateResource;
  payload: {
    auditId: Audit["id"];
    resourceId: Resource["id"];
    resourceData: UpdateResourceFormInputs;
  };
};

export type OptimisticDeleteResource = {
  action: AuditAction.DeleteResource;
  payload: {
    resourceId: Resource["id"];
  };
};

export type OptimisticAddResourceToScope = {
  action: AuditAction.addResourceToScope;
  payload: {
    scopeId: Scope["id"];
    resource: AuditResource;
  };
};

export type OptimisticRemoveResourceFromScope = {
  action: AuditAction.removeResourceFromScope;
  payload: {
    resourceId: Resource["id"];
    scopeId: Scope["id"];
  };
};

export type OptimisticAuditsAction =
  | OptimisticAuditUpdate
  // | OptimisticDeleteAudit
  | OptimisticStakeholderUpdate
  | OptimisticDeleteStakeholder
  | OptimisticScopeUpdate
  | OptimisticDeleteScope
  | OptimisticResourceUpdate
  | OptimisticDeleteResource
  | OptimisticAddResourceToScope
  | OptimisticRemoveResourceFromScope;
