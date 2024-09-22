"use client";

import React, { useState, FC } from "react";
import { Switch } from "@/components/ui/switch";

import { useUsers } from "@/state/users/hook";
import { User } from "@/state/users/types";
import { useCurrentUser } from "@/state";

type ToggleUserAdminProps = {
  user: User;
};

const ToggleUserAdmin: FC<ToggleUserAdminProps> = ({
  user: { userId, admin: isAdmin },
}) => {
  const { currentUser } = useCurrentUser();
  const { updateUser, pending } = useUsers();

  const hadleChange = (checked: boolean) => {
    if (checked) {
      updateUser({
        userId,
        userData: {
          admin: true,
        },
      });
    } else {
      updateUser({
        userId,
        userData: {
          admin: false,
        },
      });
    }
  };

  return (
    <div className="w-full flex justify-center">
      {userId === currentUser.userId ? (
        <Switch
          checked={isAdmin}
          disabled
          aria-readonly
          className="data-[state=checked]:bg-accent-500"
        />
      ) : (
        <Switch
          checked={isAdmin}
          onCheckedChange={hadleChange}
          disabled={pending}
          className="data-[state=checked]:bg-accent-500"
        />
      )}
    </div>
  );
};

export default ToggleUserAdmin;
