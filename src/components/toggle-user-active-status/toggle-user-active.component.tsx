"use client";

import React, { useState, FC } from "react";
import { Switch } from "@/components/ui/switch";

import { useUsers, useCurrentUser } from "@/state";
import { User } from "@/state/users/types";

type ToggleUserActiveStatusProps = {
  user: User;
};

const ToggleUserActiveStatus: FC<ToggleUserActiveStatusProps> = ({ user }) => {
  const { currentUser } = useCurrentUser();
  const [active, setActive] = useState(user.active);
  const { deactivateUser, activateUser, pending } = useUsers();

  const hadleChange = (checked: boolean) => {
    setActive(checked);
    if (checked) {
      activateUser({ userId: user.userId });
    } else {
      deactivateUser({ userId: user.userId });
    }
  };

  return (
    <div className="w-full flex justify-center">
      {user.userId === currentUser.userId ? (
        <Switch
          checked={active}
          disabled
          aria-readonly
          className="data-[state=checked]:bg-green-500"
        />
      ) : (
        <Switch
          checked={active}
          onCheckedChange={hadleChange}
          disabled={pending}
          className="data-[state=checked]:bg-green-500"
        />
      )}
    </div>
  );
};

export default ToggleUserActiveStatus;
