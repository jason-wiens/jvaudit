"use client";

import React, { useOptimistic, useState, useTransition } from "react";
import { useAlerts } from "@/state";

import {
  type Stakeholder,
  type Audit,
  OptimisticStakeholderAction,
  StakeholderAction,
} from "./stakeholder.types";

import { Card } from "@/components/card";
import { Button } from "@/components/ui/button";
import { StakeholderBadge } from "./stakeholder-badge.component";

import { deleteStakeholder } from "../../state/admin-audit/actions/delete-stakeholder";
import { addStakeholder } from "../../state/admin-audit/actions/add-stakeholder";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { AuditStatus, StakeholderType } from "@prisma/client";
import { formatStakeholderType } from "@/lib/formatters/stakeholder-type.formatter";
import { SelectEmployee } from "../select-employee";
import { SelectCompany } from "../select-company";

const AddButtons = [
  {
    label: "Add Operator",
    type: StakeholderType.OPERATOR,
  },
  {
    label: "Add Audit Lead",
    type: StakeholderType.AUDIT_LEAD,
  },
  {
    label: "Add Service Provider",
    type: StakeholderType.SERVICE_PROVIDER,
  },
];

type StakeholderComponentProps = {
  audit: Audit;
};

/**
 * Stakeholder Component for use in displaying, adding, and deleting stakeholders
 * from an audit. The editable variant of this component should only be used in
 * admin routes. The associated actions only revalidate the admin/audits/[auditId]
 * page. Used outside of this context, the component will not function as expected.
 *
 * @component
 *
 */
const StakeholderComponent: React.FC<StakeholderComponentProps> = ({
  audit,
}) => {
  const { auditId, stakeholders } = audit;
  const [isMutable, setIsMutable] = useState(
    audit.status === AuditStatus.CREATED
  );
  const [pending, startTransaction] = useTransition();
  const [addStakeholderType, setAddStakeholderType] =
    useState<StakeholderType | null>(null);
  const { addAlert } = useAlerts();
  const [showCompanySelection, setShowCompanySelection] = useState(false);
  const [optimisticStakeholder, setOptimisticStakeholder] = useOptimistic<
    Stakeholder[],
    OptimisticStakeholderAction
  >(stakeholders, (state, { action, payload }) => {
    switch (action) {
      case StakeholderAction.AddStakeholder:
        return [...state, payload.stakeholder];
      case StakeholderAction.DeleteStakeholder:
        return state.filter(
          (stakeholder) => stakeholder.stakeholderId !== payload.stakeholderId
        );
      default:
        return state;
    }
  });

  const handleAddStakeholder = async (company: Stakeholder["company"]) => {
    if (!addStakeholderType || !isMutable) return;
    const type = addStakeholderType;
    setAddStakeholderType(null);

    return startTransaction(async () => {
      try {
        setOptimisticStakeholder({
          action: StakeholderAction.AddStakeholder,
          payload: {
            stakeholder: {
              auditId,
              stakeholderId: "optimistic",
              tenantId: "optimistic",
              type,
              createdAt: new Date(),
              updatedAt: new Date(),
              companyId: company.companyId,
              company,
            },
          },
        });

        const { success, message } = await addStakeholder({
          auditId,
          companyId: company.companyId,
          type,
        });

        if (!success) {
          addAlert({
            type: "error",
            title: "Server Error",
            message:
              message || "An error occurred while deleting the stakeholder.",
          });
        }
      } catch (error) {
        addAlert({
          type: "error",
          title: "Server Error",
          message: "An error occurred while deleting the stakeholder.",
        });
      }
    });
  };

  const handleDelete = (stakeholderId: Stakeholder["stakeholderId"]) =>
    startTransaction(async () => {
      if (!isMutable) return;
      try {
        setOptimisticStakeholder({
          action: StakeholderAction.DeleteStakeholder,
          payload: { stakeholderId },
        });

        const { success, message } = await deleteStakeholder({
          stakeholderId,
        });

        if (!success) {
          addAlert({
            type: "error",
            title: "Server Error",
            message:
              message || "An error occurred while deleting the stakeholder.",
          });
        }
      } catch (error) {
        addAlert({
          type: "error",
          title: "Server Error",
          message: "An error occurred while deleting the stakeholder.",
        });
      }
    });

  return (
    <Card title="Stakeholders" className="">
      <div className="flex">
        <ul className="flex-1 flex gap-4">
          {optimisticStakeholder.length > 0 ? (
            <>
              {optimisticStakeholder.map((stakeholder, index) => (
                <li key={index}>
                  <StakeholderBadge
                    stakeholder={stakeholder}
                    onDelete={isMutable ? handleDelete : undefined}
                  />
                </li>
              ))}
            </>
          ) : (
            <li className="italic">No resources assigned to this audit.</li>
          )}
        </ul>
        {(!addStakeholderType || isMutable) && (
          <div className="relative group cursor-pointer">
            <div className="px-2 py-1 rounded bg-green-500 flex items-center font-bold text-white text-sm">
              Add Stakeholder
              <ChevronDown size={16} className="ml-2" />
            </div>
            <ul className="absolute right-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 bg-green-500 shadow-md p-2 shadow-dark2 z-10 w-48 rounded flex flex-col gap-1">
              {AddButtons.map(({ label, type }, index) => (
                <li
                  className="cursor-pointer hover:bg-white/20 p-2 rounded text-sm font-bold text-white flex gap-2 items-center"
                  onClick={() => setAddStakeholderType(type)}
                  key={index}
                >
                  <Plus size={16} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!!addStakeholderType && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-bold mb-2">{`Please select an employee (${formatStakeholderType(
            addStakeholderType
          )})`}</h3>
          <SelectCompany
            onCancel={() => setAddStakeholderType(null)}
            onSelect={handleAddStakeholder}
          />
        </div>
      )}
    </Card>
  );
};

export default StakeholderComponent;
