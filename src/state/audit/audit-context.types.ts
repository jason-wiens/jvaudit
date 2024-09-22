import { ServerActionResponse } from "@/types/types";

import {
  AddInformationRequestFormInputs,
  UpdateInformationRequestFormInputs,
} from "@/schemas/information-request.schema";

import {
  AddIrMessageFormInputs,
  UpdateIrMessageFormInputs,
} from "@/schemas/ir-message.schema";

export type IAuditContext = {
  audit: Audit;
  pending: boolean;
  addInformationRequest: (
    inputs: AddInformationRequestFormInputs
  ) => Promise<ServerActionResponse<AddInformationRequestFormInputs>>;
  updateInformationRequest: (inputs: {
    irId: InformationRequest["id"];
    irData: UpdateInformationRequestFormInputs;
  }) => Promise<ServerActionResponse<UpdateInformationRequestFormInputs>>;
  deleteInformationRequest: (irId: string) => Promise<ServerActionResponse>;
  addIrMessage: (inputs: {
    user: User;
    messageData: AddIrMessageFormInputs;
  }) => Promise<void>;
  editIrMessage: (inputs: {
    irId: InformationRequest["id"];
    messageId: IrMessage["id"];
    messageData: UpdateIrMessageFormInputs;
  }) => Promise<void>;
  deleteIrMessage: (inputs: {
    irId: InformationRequest["id"];
    messageId: IrMessage["id"];
  }) => Promise<void>;
};

export enum AuditAction {
  AddInformationRequest = "add:ir",
  UpdateInformationRequest = "update:ir",
  DeleteInformationRequest = "delete:ir",
  AddIrMessage = "add:irMessage",
  UpdateIrMessage = "update:irMessage",
  DeleteIrMessage = "delete:irMessage",
}

export type OptimisticAddIrMessage = {
  action: AuditAction.AddIrMessage;
  payload: {
    user: User;
    messageData: AddIrMessageFormInputs;
  };
};

export type OptimisticUpdateIrMessage = {
  action: AuditAction.UpdateIrMessage;
  payload: {
    irId: InformationRequest["id"];
    irMessageId: IrMessage["id"];
    messageData: UpdateIrMessageFormInputs;
  };
};

export type OptimisticDeleteIrMessage = {
  action: AuditAction.DeleteIrMessage;
  payload: {
    irId: InformationRequest["id"];
    irMessageId: IrMessage["id"];
  };
};

export type OptimisticAuditAction =
  | OptimisticAddIrMessage
  | OptimisticUpdateIrMessage
  | OptimisticDeleteIrMessage;
