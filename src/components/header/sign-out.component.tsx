"use client";

import { DefaultIcons } from "@/lib/default-icons";
import { signOut } from "next-auth/react";
import React from "react";

const SignOutButton = () => {
  return (
    <div
      className="flex gap-2 items-center justify-start cursor-pointer w-full"
      onClick={() => signOut()}
    >
      {DefaultIcons.Logout()}
      <span>Logout</span>
    </div>
  );
};

export default SignOutButton;
