"use client";

import React from "react";

import { TopBar } from "@/components/top-bar";
import { DollarSign, GraduationCap, Home } from "lucide-react";
import { DateRangePicker } from "@/components/date-range-picker";
import { Card } from "@/components/card";
import { useTenant, useCurrentUser, useWorkspace } from "@/state";

// import { ResponseTable } from "../../audits/[auditId]/responses/table";
// import { UserAuditsTable } from "../../audits/user-audits.table";

export default function DashboardPage() {
  const { tenant } = useTenant();
  const { currentUser } = useCurrentUser();
  const { workspace } = useWorkspace();

  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          <Home className="mr-2" size={16} />
          <span>Dashboard </span>
        </div>
        <DateRangePicker />
      </TopBar>
      <div className="p-8 w-full max-w-[1800px] mx-auto flex flex-col gap-8">
        <div className="flex gap-8">
          <div className="p-4 bg-white rounded-md border border-zinc-200 shadow-sm w-[428px]">
            <div className="flex justify-between items-center mb-4">
              <div className="">
                <h1 className="font-bold text-lg">My Score Card</h1>
                <p className="text-zinc-500 text-sm">
                  Percent of net recoveries for resolved queries
                </p>
              </div>
              <GraduationCap size={24} />
            </div>
            <div className="text-6xl">78.6%</div>
            <div className="text-sm text-zinc-500">
              <span className="text-green-500 font-bold">+ 2.6%</span> from last
              year
            </div>
          </div>

          <div className="p-4 bg-white rounded-md border border-zinc-200 shadow-sm w-[428px]">
            <div className="flex justify-between items-center mb-4">
              <div className="">
                <h1 className="font-bold text-lg">Total Recoveries</h1>
                <p className="text-zinc-500">
                  Total net recoveries for all my queries
                </p>
              </div>
              <DollarSign size={32} />
            </div>
            <div className="text-6xl">$956,236</div>
            <div className="text-sm text-zinc-500">
              <span className="text-green-500 font-bold">+ $23,456</span> from
              last year
            </div>
          </div>
        </div>
        <Card title="Current Audts" className="">
          {/* <UserAuditsTable audits={[]} /> */}
          <div className=""></div>
        </Card>
        <Card title="Current Responses" className="">
          {/* <ResponseTable /> */}
          <div className=""></div>
        </Card>
      </div>
    </div>
  );
}
