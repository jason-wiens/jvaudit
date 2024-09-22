"use client";
import { FC, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ColumnDef, DataTable } from "@/components/data-table";
import { Plus, TriangleAlert, UserCheck } from "lucide-react";
import { useUsers } from "@/state/users/hook";
import { ToggleUserActiveStatus } from "@/components/toggle-user-active-status";
import { ToggleUserAdmin } from "@/components/toggle-user-admin";
import { Skeleton } from "@/components/ui/skeleton";
import { AddUser } from "@/components/add-user";
import type { User } from "@/state/users/types";
import { ResetPassword } from "@/components/reset-password";
import { EditUser } from "@/components/edit-user";

export const usersTableColumns: ColumnDef<User>[] = [
  {
    id: "username",
    label: "Username",
    renderCell: (user) => <>{user.username}</>,
    sortableValue: (user) => user.username,
    searchableValue: (user) => user.username,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
    renderFooter: () => (
      <div className="py-2">
        <AddUser>
          <Button variant="ghost" size="sm">
            <Plus size={16} className="mr-2" />
            Add User
          </Button>
        </AddUser>
      </div>
    ),
  },
  {
    id: "active",
    label: "Active",
    align: "center",
    renderCell: (user) => <ToggleUserActiveStatus user={user} />,
    sortableValue: (user) => (user.active ? "Active" : "Inactive"),
    skeleton: () => <Skeleton className="w-[80px] h-6 rounded-full" />,
  },
  {
    id: "lastName",
    label: "Last Name",
    renderCell: (user) => <>{user.profile.personalProfile.lastName}</>,
    sortableValue: (user) => user.profile.personalProfile.lastName,
    searchableValue: (user) => user.profile.personalProfile.lastName,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
  },
  {
    id: "firstName",
    label: "First Name",
    renderCell: (user) => <>{user.profile.personalProfile.firstName}</>,
    sortableValue: (user) => user.profile.personalProfile.firstName,
    searchableValue: (user) => user.profile.personalProfile.firstName,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
  },

  {
    id: "email",
    label: "Email",
    renderCell: (user) => <>{user.profile.personalProfile.email}</>,
    sortableValue: (user) => user.profile.personalProfile.email,
    searchableValue: (user) => user.profile.personalProfile.email,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
  },
  {
    id: "forcePasswordChange",
    label: "Password Status",
    align: "center",
    renderCell: (user) => {
      return (
        <div className="w-full flex items-center justify-center">
          {user.forcePasswordChange ? (
            <div className="flex items-center gap-2 text-yellow-500">
              <TriangleAlert size={16} />
              Change Required.
            </div>
          ) : (
            <div className="flex justify-center">
              <UserCheck size={16} className="text-green-500" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "activeSince",
    label: "Active Since",
    align: "center",
    renderCell: (user) => (
      <div className="w-full flex items-center justify-center">
        {user.activeDate.toLocaleDateString()}
      </div>
    ),
    sortableValue: (user) => user.activeDate,
    skeleton: () => <Skeleton className="w-[120px] h-6 rounded" />,
  },
  {
    id: "admin",
    label: "Admin",
    align: "center",
    renderCell: (user) => <ToggleUserAdmin user={user} />,
    skeleton: () => <Skeleton className="w-[80px] h-6 rounded-full" />,
  },
  {
    id: "actions",
    label: "",
    align: "center",
    renderCell: (user) => (
      <div className="flex w-full justify-center items-center gap-1">
        <EditUser user={user} />
        <ResetPassword user={user} />
      </div>
    ),
    skeleton: () => <Skeleton className="w-4 h-8 rounded" />,
  },
];

export const UsersTable: FC = () => {
  const { users } = useUsers();

  return (
    <>
      <DataTable
        columns={usersTableColumns}
        data={users}
        searchable={true}
        rowIdKey="userId"
      />
    </>
  );
};
