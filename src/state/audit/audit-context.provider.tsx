"use client";

import { createContext, useOptimistic, useTransition } from "react";

import {
  AuditAction,
  IAuditContext,
  OptimisticAuditAction,
} from "./audit-context.types";

import type {
  AddInformationRequestFormInputs,
  UpdateInformationRequestFormInputs,
} from "@/schemas/information-request.schema";

import type {
  AddIrMessageFormInputs,
  UpdateIrMessageFormInputs,
} from "@/schemas/ir-message.schema";

import type {
  FailedServerActionResponse,
  ServerActionResponse,
} from "@/types/types";

import {
  addInformationRequest,
  updateInformationRequest,
  deleteInformationRequest,
  addIrMessage,
  updateIrMessage,
  deleteIrMessage,
} from "@/state/informations-requests/actions";

import { useAlerts } from "@/state";

export const AuditContext = createContext<IAuditContext | null>(null);

export type AuditContextProviderProps = {
  audit: Audit;
  children: React.ReactNode;
};

export default function AuditContextProvider({
  audit,
  children,
}: AuditContextProviderProps) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
  const [optimisticAudit, setOptimisticAudit] = useOptimistic<
    Audit,
    OptimisticAuditAction
  >(audit, (state, { action, payload }) => {
    switch (action) {
      case AuditAction.AddIrMessage:
        return {
          ...state,
          irs: state.irs.map((ir) => {
            if (ir.id === payload.messageData.irId) {
              return {
                ...ir,
                correspondence: [
                  ...ir.correspondence,
                  {
                    id: `${Date.now()}`,
                    body: payload.messageData.body,
                    date: new Date(),
                    author: payload.user,
                  },
                ],
              };
            }
            return ir;
          }),
        };
      case AuditAction.UpdateIrMessage:
        return {
          ...state,
          irs: state.irs.map((ir) => {
            if (ir.id === payload.irId) {
              return {
                ...ir,
                correspondence: ir.correspondence.map((message) =>
                  message.id === payload.irMessageId
                    ? { ...message, body: payload.messageData.body }
                    : message
                ),
              };
            }
            return ir;
          }),
        };
      case AuditAction.DeleteIrMessage:
        return {
          ...state,
          irs: state.irs.map((ir) => {
            if (ir.id === payload.irId) {
              return {
                ...ir,
                correspondence: ir.correspondence.filter(
                  (message) => message.id !== payload.irMessageId
                ),
              };
            }
            return ir;
          }),
        };
      default:
        return state;
    }
  });

  const handleAddInformationRequest = async (
    irData: AddInformationRequestFormInputs
  ) => {
    return await addInformationRequest(irData);
  };

  const handleUpdateInformationRequest = async (inputs: {
    irId: InformationRequest["id"];
    irData: UpdateInformationRequestFormInputs;
  }) => {
    return await updateInformationRequest(inputs);
  };

  const handleDeleteInformationRequest = async (irId: string) => {
    // You cannot delete a submitted IR
    const ir = optimisticAudit.irs.find((ir) => ir.id === irId);
    if (!ir) {
      return {
        success: false,
        message: "Information Request not found",
      } as FailedServerActionResponse;
    }
    if (ir.submitted) {
      return {
        success: false,
        message: "Cannot delete a submitted Information Request",
      } as FailedServerActionResponse;
    }

    return await deleteInformationRequest(irId);
  };

  const handleOptimisticAddIrMessage = async (inputs: {
    user: User;
    messageData: AddIrMessageFormInputs;
  }) =>
    startTransaction(async () => {
      setOptimisticAudit({
        action: AuditAction.AddIrMessage,
        payload: {
          user: inputs.user,
          messageData: inputs.messageData,
        },
      });

      const { success } = await addIrMessage(inputs.messageData);

      if (!success) {
        addAlert({
          type: "error",
          title: "Failed to add message",
          text: "Rolling back changes. Please try again.",
        });
      }
    });

  const handleOptimisticUpdateIrMessage = async (inputs: {
    irId: InformationRequest["id"];
    messageId: IrMessage["id"];
    messageData: UpdateIrMessageFormInputs;
  }) =>
    startTransaction(async () => {
      setOptimisticAudit({
        action: AuditAction.UpdateIrMessage,
        payload: {
          irId: inputs.irId,
          irMessageId: inputs.messageId,
          messageData: inputs.messageData,
        },
      });

      const { success } = await updateIrMessage({
        messageId: inputs.messageId,
        messageData: inputs.messageData,
      });

      if (!success) {
        addAlert({
          type: "error",
          title: "Failed to update message",
          text: "Rolling back changes. Please try again.",
        });
      }
    });

  const handleOptimiticDeleteIrMessage = async (inputs: {
    irId: InformationRequest["id"];
    messageId: IrMessage["id"];
  }) =>
    startTransaction(async () => {
      // you can only delete messages for unresolved IRs
      const ir = optimisticAudit.irs.find((ir) => ir.id === inputs.irId);
      if (ir?.resolved) {
        addAlert({
          type: "error",
          title: "Cannot delete message",
          text: "Cannot delete messages for resolved IRs",
        });
        return;
      }

      setOptimisticAudit({
        action: AuditAction.DeleteIrMessage,
        payload: {
          irId: inputs.irId,
          irMessageId: inputs.messageId,
        },
      });

      const { success } = await deleteIrMessage(inputs.messageId);

      if (!success) {
        addAlert({
          type: "error",
          title: "Failed to delete message",
          text: "Rolling back changes. Please try again.",
        });
      }
    });

  return (
    <AuditContext.Provider
      value={{
        audit: optimisticAudit,
        pending,
        addInformationRequest: handleAddInformationRequest,
        updateInformationRequest: handleUpdateInformationRequest,
        deleteInformationRequest: handleDeleteInformationRequest,
        addIrMessage: handleOptimisticAddIrMessage,
        editIrMessage: handleOptimisticUpdateIrMessage,
        deleteIrMessage: handleOptimiticDeleteIrMessage,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}
