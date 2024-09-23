import { ResourceType, StakeholderType, Workspace } from "@prisma/client";
import React, { FC } from "react";
import type { Audit } from "@/state/audit/types";
import { getAudit } from "@/state/audit/actions";

import { Card } from "@/components/card";
import { TopBar } from "@/components/top-bar";
import { LayoutDashboard } from "lucide-react";
import { NotAuthorized } from "@/components/not-authorized";

import { logError } from "@/lib/logging";
import { ServerError } from "@/components/server-error";
import { KeyValue, type KeyValueData } from "@/components/key-value";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { auth } from "@/state/auth/next-auth.config";
import { handleServerError } from "@/lib/handle-server-errors";
import { beautifyEnumTerm } from "@/lib/beautify-enums";

type AuditPageProps = {
  params: {
    workspaceId: Workspace["workspaceId"];
    auditId: Audit["auditId"];
  };
};

const AuditPage: FC<AuditPageProps> = async ({
  params: { auditId, workspaceId },
}) => {
  const session = await auth();

  if (!session) return <NotAuthorized />;

  try {
    const audit = await getAudit({ auditId, user: session.user });
    if (!audit) throw new Error("Audit not found");

    const data: KeyValueData[] = [
      {
        label: "Audit Number",
        labelDescription: "A unique identifier used to identify this audit.",
        values: [
          <p className="font-semibold text-lg" key={1}>
            {audit.auditNumber}
          </p>,
        ],
      },
      {
        label: "Audit Description",
        labelDescription: "A short description of the audit.",
        values: [
          <p className="font-semibold text-lg" key={2}>
            {audit.auditDescription}
          </p>,
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
              <div className="pt-2" key={3}>
                <Badge variant="accent" label={`${beautifyEnumTerm(s.type)}`}>
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
            .map((s, i) => (
              <div className="pt-2" key={i}>
                <Badge variant="primary" label={`${beautifyEnumTerm(s.type)}`}>
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
          .map((r, i) => (
            <Avatar
              user={r.employee.personalProfile}
              size="md"
              variant="dark"
              showDetails
              key={i}
            />
          )),
      },
      {
        label: "Audit Contact (Audit Lead / Non-Operator)",
        labelDescription: "Other stakeholder contact(s) for the audit.",
        values: audit.resources
          .filter((r) => r.type === ResourceType.AUDIT_CONTACT_NON_OPERATOR)
          .map((r, i) => (
            <Avatar
              user={r.employee.personalProfile}
              size="md"
              variant="dark"
              showDetails
              key={i}
            />
          )),
      },
      {
        label: "Auditors",
        labelDescription:
          "The auditors assigned to the audit. The auditor's are responsible for executing the audit fieldwork.",
        values: audit.resources
          .filter((r) => r.type === ResourceType.AUDITOR)
          .map((r, i) => (
            <Avatar
              user={r.employee.personalProfile}
              size="md"
              variant="secondary"
              showDetails
              key={i}
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
  } catch (error) {
    handleServerError({
      error,
      user: session.user,
      message: "Unable to fetch audit",
    });
    return <ServerError message="Unable to get audit information" />;
  }
};

export default AuditPage;
