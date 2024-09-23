"use client";

import React, { useState, useEffect } from "react";
import { useStringParam } from "@/hooks/use-string-param.hook";

import { useCompany } from "@/state";
import { Company, Employee } from "@/state/company/types";

import { TopBar } from "@/components/top-bar";
import { EditCompanyForm } from "@/components/forms/company";
import { Card } from "@/components/card";
import { DataTable } from "@/components/data-table";
import { AddEmployee } from "@/components/add-employee";
import { Button } from "@/components/ui/button";
import { employeeColumns } from "./employee.table";
import { Plus, Building2 } from "lucide-react";

export default function CompanyPage() {
  const { company, changePrimaryContact, deleteEmployee } = useCompany();

  return (
    <>
      <TopBar className="justify-between">
        <div className="flex items-center">
          <Building2 className="mr-2" size={16} />
          {`Companies / ${company?.fullLegalName || "Edit"}`}
        </div>
        <AddEmployee>
          <Button variant="add" size="sm">
            Add Employee <Plus size={16} className="ml-2" />
          </Button>
        </AddEmployee>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto flex flex-col gap-8">
        <Card title="Company Information" className="">
          <div className="flex items-center gap-8 pl-4">
            <div className="p-5 bg-secondary-500/20 rounded-full">
              <Building2 className="w-10 h-10 text-secondary-500" />
            </div>
            <EditCompanyForm />
          </div>
        </Card>
        <Card title="Employees" className="">
          <DataTable
            columns={employeeColumns}
            data={company?.employees || []}
            rowIdKey="employeeId"
          />
        </Card>
      </div>
    </>
  );
}
