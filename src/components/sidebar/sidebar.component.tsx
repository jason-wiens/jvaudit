"use client";

import React from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { usePathname, useParams } from "next/navigation";

import { menuItems } from "./menu-items";

import { Building2 } from "lucide-react";
import { isPermitted } from "@/permissions/is-permitted";

import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const params = useParams();

  if (!session)
    return (
      <div className="bg-zinc-50 h-full w-full border-r border-zinc-200" />
    );
  const {
    user: { role: userRoles, tenantName },
  } = session;

  return (
    <div className="bg-zinc-50 h-full w-full border-r border-zinc-200">
      <div className="w-full px-6 h-14 border-b border-zinc-200 flex gap-2 items-center">
        <Building2 size={16} />
        <p className="capitalize font-semibold">{tenantName}</p>
      </div>
      <ul className="w-full px-4 py-4 flex flex-col gap-1 border-b border-zinc-200">
        {menuItems.map((item, index) => {
          if (isPermitted(item.access, userRoles)) {
            return (
              <li key={index}>
                <Link
                  href={item.href(params)}
                  className={cn(
                    "block px-2 py-1 hover:bg-zinc-200 rounded-lg",
                    item.isActive(pathname) &&
                      "bg-secondary-500/20 text-secondary-900 hover:bg-secondary-500/20 hover:text-secondary-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                </Link>
              </li>
            );
          }
        })}
      </ul>
      {menuItems.map((item, index) => {
        if (item.isActive(pathname) && item.submenu) {
          return (
            <div key={index}>
              <div className="w-full px-6 pt-2 text-sm font-semibold text-zinc-500">
                {item.label}
              </div>
              <ul className="w-full pl-6 pr-4 pt-2 pb-4 flex flex-col gap-1 border-b border-zinc-200">
                {item.submenu.map((subitem, index) => (
                  <li key={index}>
                    <Link
                      href={subitem.href(params)}
                      className={cn(
                        "block px-2 py-1 hover:bg-zinc-200 rounded-lg",
                        subitem.isActive(pathname) &&
                          "bg-secondary-500/20 text-secondary-900 hover:bg-secondary-500/20 hover:text-secondary-900"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {subitem.icon}
                        <p>{subitem.label}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
      })}
    </div>
  );
}
