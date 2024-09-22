"use client";

import React, { useEffect, useOptimistic, useTransition } from "react";

import { ResourceType } from "@prisma/client";
import {
  Audit,
  Employee,
  OptimisticResourceAction,
  Resource,
  ResourceAction,
} from "./audit-resource.types";

import { addResource } from "../../state/admin-audit/actions/add-resource";
import { deleteResource } from "../../state/admin-audit/actions/delete-resource";

import { Card } from "@/components/card";
import { SelectEmployee } from "@/components/select-employee";
import { ResourceBadge } from "./resource-badge.component";
import { ChevronDown, Plus } from "lucide-react";
import { useAlerts } from "@/state";
import { capitalize } from "@/lib/utils";
import { formatResourceType } from "@/lib/formatters/audit-resource.formatter";

const AddButtons = [
  {
    label: "Add Operator Contact",
    type: ResourceType.AUDIT_CONTACT_OPERATOR,
  },
  {
    label: "Add Audit Lead Contact",
    type: ResourceType.AUDIT_CONTACT_NON_OPERATOR,
  },
  {
    label: "Add Auditor",
    type: ResourceType.AUDITOR,
  },
];

type AuditResourcesProps = {
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
const AuditResources: React.FC<AuditResourcesProps> = ({ audit }) => {
  const { auditId, resources, stakeholders } = audit;
  const [potentialResources, setPotentialResources] = React.useState<
    Employee[]
  >([]);
  const { addAlert } = useAlerts();
  const [addResourceType, setAddResourceType] =
    React.useState<ResourceType | null>(null);
  const [pending, startTransaction] = useTransition();
  const [optimisticResources, setOptimisticResources] = useOptimistic<
    Resource[],
    OptimisticResourceAction
  >(resources, (state, { action, payload }) => {
    switch (action) {
      case ResourceAction.AddResource:
        return [...state, payload.resource];
      case ResourceAction.DeleteResource:
        return state.filter((r) => r.resourceId !== payload.resourceId);
      default:
        return state;
    }
  });

  useEffect(() => {
    const operatorEmployees =
      stakeholders.find((s) => s.type === "OPERATOR")?.company.employees || [];
    const leadEmployees =
      stakeholders.find((s) => s.type === "AUDIT_LEAD")?.company.employees ||
      [];

    const allAvailableEmployees: Employee[] = [];
    for (const stakeholder of stakeholders) {
      allAvailableEmployees.push(...stakeholder.company.employees);
    }
    switch (addResourceType) {
      case ResourceType.AUDIT_CONTACT_OPERATOR:
        setPotentialResources(operatorEmployees);
        break;
      case ResourceType.AUDIT_CONTACT_NON_OPERATOR:
        setPotentialResources(leadEmployees);
        break;
      case ResourceType.AUDITOR:
        setPotentialResources(allAvailableEmployees);
        break;
      default:
        setPotentialResources([]);
    }
  }, [addResourceType]);

  const handleAddResource = (employee: Employee) => {
    if (!addResourceType) return;
    const type = addResourceType;
    setAddResourceType(null);

    return startTransaction(async () => {
      try {
        setOptimisticResources({
          action: ResourceAction.AddResource,
          payload: {
            resource: {
              resourceId: "optimistic",
              tenantId: "optimistic",
              auditId,
              type,
              createdAt: new Date(),
              updatedAt: new Date(),
              active: true,
              activeDate: new Date(),
              employeeId: employee.employeeId,
              employee,
              assignedToId: null,
              description: null,
            },
          },
        });

        const { success, message } = await addResource({
          auditId,
          employeeId: employee.employeeId,
          type,
        });

        if (!success) {
          addAlert({
            title: "Server Error",
            text: message || "Failed to add resource. Rolling back changes.",
            type: "error",
          });
        }
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Error",
          text: "Failed to add resource. Rolling back changes.",
          type: "error",
        });
      }
    });
  };

  const handleDeleteResource = (resourceId: Resource["resourceId"]) =>
    startTransaction(async () => {
      try {
        setOptimisticResources({
          action: ResourceAction.DeleteResource,
          payload: { resourceId },
        });

        const { success, message } = await deleteResource({ resourceId });

        if (!success) {
          addAlert({
            title: "Server Error",
            text: message || "Failed to delete resource. Rolling back changes.",
            type: "error",
          });
        }
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Error",
          text: "Failed to delete resource. Rolling back changes.",
          type: "error",
        });
      }
    });

  return (
    <Card title="Resources" className="">
      <div className="flex">
        <ul className="flex-1 flex gap-4">
          {optimisticResources.length > 0 ? (
            <>
              {optimisticResources.map((resource, index) => (
                <li key={index}>
                  <ResourceBadge
                    resource={resource}
                    onDelete={handleDeleteResource}
                  />
                </li>
              ))}
            </>
          ) : (
            <li className="italic">No resources assigned to this audit.</li>
          )}
        </ul>
        {!addResourceType && (
          <div className="relative group cursor-pointer">
            <div className="px-2 py-1 rounded bg-green-500 flex items-center font-bold text-white text-sm">
              Add Resource
              <ChevronDown size={16} className="ml-2" />
            </div>
            <ul className="absolute right-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 bg-green-500 shadow-md p-2 shadow-dark2 z-10 w-48 rounded flex flex-col gap-1">
              {AddButtons.map(({ label, type }, index) => (
                <li
                  className="cursor-pointer hover:bg-white/20 p-2 rounded text-sm font-bold text-white flex gap-2 items-center"
                  onClick={() => setAddResourceType(type)}
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
      {!!addResourceType && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-bold mb-2">{`Please select an employee (${formatResourceType(
            addResourceType
          )})`}</h3>
          <SelectEmployee
            employees={potentialResources}
            onCancel={() => setAddResourceType(null)}
            onSelect={handleAddResource}
          />
        </div>
      )}
    </Card>
  );
};

export default AuditResources;
