import { FC, useState } from "react";

import { AppRoutes } from "@lib/routes.app";
import { Button } from "../ui/button";

type UserMenuProps = {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

const UserMenu: FC<UserMenuProps> = ({ user }) => {
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const { firstName, lastName, email } = user;

  const handleLogout = async () => {
    // setBusy(true);
    // logout();
    // navigate(AppRoutes.LoginPage());
  };

  return (
    <div className="relative bg-white shadow-dark4 py-4 px-8 rounded border-l-8 border-secondary-500">
      <div className="font-semibold">
        {firstName} {lastName}
      </div>
      <div className="text-sm mb-8 text-secondary-500">{email}</div>
      <Button>Logout</Button>
    </div>
  );
};

export default UserMenu;
