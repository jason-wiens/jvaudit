"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";
import { Home, Table, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "./types";
import { useWorkspace } from "@/state";

export function BaseMenu() {
  const pathname = usePathname();
  const {
    workspace: { workspaceId },
  } = useWorkspace();

  const baseMenuItems: MenuItem[] = [
    {
      label: "Home",
      href: workspaceId ? AppRoutes.Dashboard({ workspaceId }) : "#",
      icon: <Home size={16} />,
      isActive: (pathname: string) =>
        pathname === AppRoutes.Dashboard({ workspaceId }),
    },
    {
      label: "Audits",
      href: workspaceId ? AppRoutes.Audits({ workspaceId }) : "#",
      icon: <Table size={16} />,
      isActive: (pathname: string) => pathname.includes("app/audits"),
    },
    {
      label: "Settings",
      href: AppRoutes.UserSettings(),
      icon: <Settings size={16} />,
      isActive: (pathname: string) => pathname === AppRoutes.UserSettings(),
    },
    {
      label: "Notifications",
      href: AppRoutes.UserNotifications(),
      icon: <Bell size={16} />,
      isActive: (pathname: string) =>
        pathname === AppRoutes.UserNotifications(),
    },
  ];

  return (
    <ul className="w-full px-4 py-4 flex flex-col gap-1 border-b border-zinc-200">
      {baseMenuItems.map((item, index) => (
        <li key={index}>
          <Link
            href={item.href}
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
      ))}
    </ul>
  );
}
