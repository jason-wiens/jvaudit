"use client";

import React from "react";

import { BaseMenu } from "./base.menu";
import { AdminMenu } from "./admin.menu";
import { SuperUserMenu } from "./su.menu";

import { useCurrentUser, useWorkspace } from "@/state";

import { Layers3 } from "lucide-react";

export default function Sidebar() {
  const { currentUser, isAdmin, isSuperUser } = useCurrentUser();
  const { workspace } = useWorkspace();

  return (
    <div className="bg-zinc-50 h-full w-full border-r border-zinc-200">
      <div className="w-full px-6 h-14 border-b border-zinc-200 flex gap-2 items-center">
        <Layers3 size={16} />
        <p className="capitalize font-semibold">{workspace.name}</p>
      </div>
      <BaseMenu />
      {isAdmin && <AdminMenu />}
      {isSuperUser && <SuperUserMenu />}
    </div>
  );
}
