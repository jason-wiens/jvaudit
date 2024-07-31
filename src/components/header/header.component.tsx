"use client";

import { FC, useState } from "react";
import { useSession } from "next-auth/react";

import { Avatar } from "@/components/avatar";
import { Logo } from "@/components/logo";
import UserMenu from "./user-menu.component";

const HeaderApp: FC = () => {
  const [menuOpen, toggleMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="w-full flex justify-between items-center px-6 py-2 bg-primary-900">
      <Logo variant="white" />
      {status === "authenticated" && (
        <Avatar
          user={session.user}
          variant="light"
          size="sm"
          onClick={() => toggleMenuOpen((current) => !current)}
          className="cursor-pointer"
        />
      )}
      {menuOpen && status === "authenticated" && (
        <div className="absolute w-[100vw] h-[100vh] top-0 right-0 z-50">
          <div className="absolute top-12 right-4">
            <UserMenu
              user={{
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                email: session.user.email || "",
              }}
            />
          </div>
          <div
            className="w-full h-full bg-primary-900/20"
            onClick={() => toggleMenuOpen(false)}
          ></div>
        </div>
      )}
    </header>
  );
};

export default HeaderApp;
