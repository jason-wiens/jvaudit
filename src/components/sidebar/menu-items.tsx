import React from "react";
import {
  Home,
  Table,
  Route,
  Users,
  Building,
  LayoutDashboard,
} from "lucide-react";

import { AppRoutes, AppRouteParams } from "@/lib/routes.app";
import { Role } from "@prisma/client";

export type MenuItem = {
  label: string;
  href: (param: AppRouteParams) => string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
  access: Role[];
  submenu?: MenuItem[];
};

const iconSize = 16;

export const menuItems: MenuItem[] = [
  {
    label: "Home",
    href: AppRoutes.Dashboard,
    icon: <Home size={iconSize} />,
    isActive: (pathname: string) => pathname === AppRoutes.Dashboard(),
    access: [Role.USER],
  },
  {
    label: "My Audits",
    href: AppRoutes.Audits,
    icon: <Table size={iconSize} />,
    isActive: (pathname: string) => pathname.includes("app/audits"),
    access: [Role.USER],
    submenu: [
      {
        label: "Audit",
        href: AppRoutes.GeneralInfo,
        icon: <Route size={iconSize} />,
        isActive: (pathname: string) =>
          pathname.includes("app/audits") && pathname.includes("general"),
        access: [Role.USER],
      },
      {
        label: "Information Requests",
        href: AppRoutes.AuditIRs,
        icon: <Route size={iconSize} />,
        isActive: (pathname: string) =>
          pathname.includes("app/audits") && pathname.includes("irs"),
        access: [Role.USER],
      },
      {
        label: "Queries",
        href: AppRoutes.AuditQueries,
        icon: <Route size={iconSize} />,
        isActive: (pathname: string) =>
          pathname.includes("app/audits") && pathname.includes("queries"),
        access: [Role.USER],
      },
      {
        label: "Report",
        href: AppRoutes.AuditReport,
        icon: <Route size={iconSize} />,
        isActive: (pathname: string) =>
          pathname.includes("app/audits") && pathname.includes("report"),
        access: [Role.USER],
      },
      {
        label: "Responses",
        href: AppRoutes.AuditResponses,
        icon: <Route size={iconSize} />,
        isActive: (pathname: string) =>
          pathname.includes("app/audits") && pathname.includes("responses"),
        access: [Role.USER],
      },
    ],
  },
  {
    label: "Admin",
    href: AppRoutes.AdminDashboard,
    icon: <Route size={iconSize} />,
    isActive: (pathname: string) => pathname.includes("admin"),
    access: [Role.ADMIN],
    submenu: [
      {
        label: "Dashboard",
        href: AppRoutes.AdminAudits,
        icon: <LayoutDashboard size={iconSize} />,
        isActive: (pathname: string) => pathname === AppRoutes.AdminDashboard(),
        access: [Role.ADMIN],
      },
      {
        label: "Audits",
        href: AppRoutes.AdminAudits,
        icon: <Table size={iconSize} />,
        isActive: (pathname: string) => pathname.includes("admin/audits"),
        access: [Role.ADMIN],
      },
      {
        label: "Companies",
        href: AppRoutes.AdminCompanies,
        icon: <Building size={iconSize} />,
        isActive: (pathname: string) => pathname.includes("admin/companies"),
        access: [Role.ADMIN],
      },
      {
        label: "Users",
        href: AppRoutes.AdminUsers,
        icon: <Users size={iconSize} />,
        isActive: (pathname: string) => pathname.includes("admin/users"),
        access: [Role.ADMIN],
      },
    ],
  },
];
