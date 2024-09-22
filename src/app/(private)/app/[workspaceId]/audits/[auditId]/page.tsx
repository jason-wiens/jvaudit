import { ResourceType, Role, StakeholderType } from "@prisma/client";
import React, { FC } from "react";

import { Card } from "@/components/card";
import { TopBar } from "@/components/top-bar";
import { LayoutDashboard } from "lucide-react";
import { checkAuthAndPermissions } from "@/permissions/check-permissions";
import { NotAuthorized } from "@/components/not-authorized";

import { logError } from "@/lib/logging";
import { ServerError } from "@/components/server-error";
import { KeyValue, type KeyValueData } from "@/components/key-value";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { formatStakeholderType } from "@/lib/formatters/stakeholder-type.formatter";

type AuditPageProps = {
  params: {
    auditId: Audit["auditId"];
  };
};

const AuditPage: FC<AuditPageProps> = async ({ params: { auditId } }) => {
  // check permissions
  const session = await checkAuthAndPermissions({
    accessLevelRequired: Role.USER,
  });
  if (!session) return <NotAuthorized />;

  const tenantId = session.user.tenantId;

  let audit: Audit | null = null;

  try {
    audit = await getAuditInfo({ auditId, tenantId });
  } catch (error) {
    logError({
      timestamp: new Date(),
      user: session.user,
      error,
      message: "Error getting audit info",
    });
    return <ServerError msg="Unable to get audit information" />;
  }

  if (!audit) return <ServerError msg="Audit not found" />;

  const operator: Operator | undefined = audit.stakeholders.find(
    (s) => s.type === StakeholderType.OPERATOR
  );

  const data: KeyValueData[] = [
    {
      label: "Audit Number",
      labelDescription: "A unique identifier used to identify this audit.",
      values: [<p className="font-semibold text-lg">{audit.auditNumber}</p>],
    },
    {
      label: "Audit Description",
      labelDescription: "A short description of the audit.",
      values: [
        <p className="font-semibold text-lg">{audit.auditDescription}</p>,
      ],
    },
    {
      label: "Audit Status",
      labelDescription:
        "The current status of the audit: Created, Confirmed, Preperation, Fieldwork, Report, Response/Rebuttal, Closed.",
      values: [audit.status],
    },
    {
      label: "Operator",
      labelDescription: "The operator being audited",
      values: [
        audit.stakeholders
          .filter((s) => s.type === StakeholderType.OPERATOR)
          .map((s) => (
            <div className="pt-2">
              <Badge
                variant="accent"
                label={`${formatStakeholderType(s.type)}`}
              >
                <p className="font-semibold">{s.company.fullLegalName}</p>
              </Badge>
            </div>
          )),
      ],
    },
    {
      label: "Audit Lead / Other Stakeholders",
      labelDescription:
        "The audit lead and other stakeholders, other stakeholders can consist of the audit participants, non-operating owners, and service providers.",
      values: [
        audit.stakeholders
          .filter((s) => s.type !== StakeholderType.OPERATOR)
          .map((s) => (
            <div className="pt-2">
              <Badge
                variant="primary"
                label={`${formatStakeholderType(s.type)}`}
              >
                <p className="font-semibold">{s.company.fullLegalName}</p>
              </Badge>
            </div>
          )),
      ],
    },
    {
      label: "Audit Contact (Operator)",
      labelDescription:
        "The primary contact(s) for the audit. All information requests, reports, responses will be submitted the audit contacts at the Operator's office.",
      values: audit.resources
        .filter((r) => r.type === ResourceType.AUDIT_CONTACT_OPERATOR)
        .map((r) => (
          <Avatar
            user={r.employee.personalProfile}
            size="md"
            variant="dark"
            showDetails
          />
        )),
    },
    {
      label: "Audit Contact (Audit Lead / Non-Operator)",
      labelDescription: "Other stakeholder contact(s) for the audit.",
      values: audit.resources
        .filter((r) => r.type === ResourceType.AUDIT_CONTACT_NON_OPERATOR)
        .map((r) => (
          <Avatar
            user={r.employee.personalProfile}
            size="md"
            variant="dark"
            showDetails
          />
        )),
    },
    {
      label: "Auditors",
      labelDescription:
        "The auditors assigned to the audit. The auditor's are responsible for executing the audit fieldwork.",
      values: audit.resources
        .filter((r) => r.type === ResourceType.AUDITOR)
        .map((r) => (
          <Avatar
            user={r.employee.personalProfile}
            size="md"
            variant="secondary"
            showDetails
          />
        )),
    },
    {
      label: "Audit Scope",
      labelDescription:
        "The scope of the audit. The scope defines the are of operations (ex. Cap, Opex, PA, Fees, etc) to be rieviewed, the fieldwork dates, and properties to be audited.",
      values: [],
    },
  ];

  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          <LayoutDashboard className="mr-2" size={16} />
          {`Audit / ${audit.auditNumber} - ${audit.auditDescription} / Information`}
        </div>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto flex flex-col gap-8">
        <Card title="Audit Information" className="p-8">
          <KeyValue data={data} />
        </Card>
        <Card title="Documents" className="">
          <div className="italic mb-14">Comming Soon...</div>
        </Card>
        <Card title="Notes" className="">
          <div className="italic mb-14">Comming Soon...</div>
        </Card>
      </div>
    </div>
  );
};

export default AuditPage;
