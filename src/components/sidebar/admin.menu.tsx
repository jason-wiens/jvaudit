"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";
import { Users, Building2, BellDot, LayoutPanelTop } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "./types";

export function AdminMenu() {
  const pathname = usePathname();

  const adminMenuItems: MenuItem[] = [
    {
      label: "Users",
      href: AppRoutes.Users(),
      icon: <Users size={16} />,
      isActive: (pathname: string) => pathname === AppRoutes.Users(),
    },
    {
      label: "Companies",
      href: AppRoutes.Companies(),
      icon: <Building2 size={16} />,
      isActive: (pathname: string) => pathname === AppRoutes.Companies(),
    },
    {
      label: "Notification Settings",
      href: AppRoutes.NotificatonSettings(),
      icon: <BellDot size={16} />,
      isActive: (pathname: string) =>
        pathname === AppRoutes.NotificatonSettings(),
    },
    {
      label: "Workspaces",
      href: AppRoutes.Workspaces(),
      icon: <LayoutPanelTop size={16} />,
      isActive: (pathname: string) => pathname === AppRoutes.Workspaces(),
    },
  ];

  return (
    <div className="border-b border-zinc-200">
      <h3 className="px-6 pt-4 mb-2 font-semibold">Administration</h3>
      <ul className="w-full px-4 pb-4 flex flex-col gap-1">
        {adminMenuItems.map((item, index) => (
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
    </div>
  );
}
