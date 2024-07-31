"use client";

import React, { useState, useEffect } from "react";
import { useStringParam } from "@/hooks/use-string-param.hook";

import { useAuditsContext } from "@/hooks/context.hook";

import { TopBar } from "@/components/top-bar";
import { UpdateAuditForm } from "@/components/forms/audits";
import { Card } from "@/components/card";
import { DataTable } from "@/components/data-table";
import { AddEmployee } from "@/components/add-employee";
import { Button } from "@/components/ui/button";

import { Plus, Building2, Shield } from "lucide-react";
import { useAlerts } from "@/state/alerts.state";
import { UpdateEmployee } from "@/components/update-employee";
import { AddStakeholder } from "@/components/add-stakeholder";
import { StakeholderType } from "@/types/enums";

export default function AuditPage() {
  const { audits } = useAuditsContext();
  const { addAlert } = useAlerts();
  const auditId = useStringParam("auditId");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [operator, setOperator] = useState<AuditStakeholder | null>(null);
  const [lead, setLead] = useState<AuditStakeholder | null>(null);

  useEffect(() => {
    setAudit(audits.find((a) => a.id === auditId) || null);
  }, [auditId, audits]);

  useEffect(() => {
    if (!!audit) {
      setOperator(
        audit.stakeholders.find((s) => s.type === StakeholderType.OPERATOR) ||
          null
      );
    }
  }, [audit]);

  useEffect(() => {
    if (!!audit) {
      setLead(
        audit.stakeholders.find((s) => s.type === StakeholderType.AUDIT_LEAD) ||
          null
      );
    }
  }, [audit]);

  return (
    <>
      <TopBar className="justify-between">
        <div className="flex items-center">
          <Shield className="mr-2" size={16} />
          {`Audits / ${audit?.auditNumber || "Setup"}`}
        </div>
        <div className=""></div>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto flex flex-col gap-8">
        <Card title="Audit Information" className="">
          <div className="flex items-center gap-8 pl-4">
            <div className="p-4 bg-secondary-500/20 rounded-full">
              <Shield className="w-10 h-10 text-secondary-500" />
            </div>
            <UpdateAuditForm auditId={auditId} />
          </div>
        </Card>
        <div className="">
          {!operator ? (
            <AddStakeholder type={StakeholderType.OPERATOR}>
              <Button variant="add" size="sm">
                Add Operator <Plus size={16} className="ml-2" />
              </Button>
            </AddStakeholder>
          ) : (
            <Card title="Operator" className="">
              <div className="flex items-center gap-8 pl-4">
                <div className="p-5 bg-secondary-500/20 rounded-full">
                  <Building2 className="w-10 h-10 text-secondary-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold">
                    {operator?.company.fullLegalName}
                  </span>
                  <span>{operator?.company.shortName}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
        {/* <UpdateEmployee
          employee={updateEmployee}
          open={isUpdateEmployeeModalOpen}
          close={() => setIsUpdateEmployeeModalOpen(false)}
        /> */}
      </div>
    </>
  );
}
