"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";
import { LayoutDashboard, Castle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "./types";

export function SuperUserMenu() {
  const pathname = usePathname();

  const suMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: AppRoutes.SuperUserDashboard(),
      icon: <LayoutDashboard size={16} />,
      isActive: (pathname: string) =>
        pathname === AppRoutes.SuperUserDashboard(),
    },
    {
      label: "Tenants",
      href: AppRoutes.SuperUserTenants(),
      icon: <Castle size={16} />,
      isActive: (pathname: string) => pathname === AppRoutes.SuperUserTenants(),
    },
    {
      label: "Billings",
      href: AppRoutes.SuperUserBilling(),
      icon: <DollarSign size={16} />,
      isActive: (pathname: string) => pathname === AppRoutes.SuperUserBilling(),
    },
  ];

  return (
    <div className="border-b border-zinc-200">
      <h3 className="px-6 pt-4 mb-2 font-semibold">Super User</h3>
      <ul className="w-full px-4 pb-4 flex flex-col gap-1">
        {suMenuItems.map((item, index) => (
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
