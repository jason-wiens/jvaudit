import React, { FC, Suspense } from "react";

import { CompaniesStateProvider } from "@/state";

type props = {
  children: React.ReactNode;
};

export const DashboardLayout: FC<props> = ({ children }) => (
  <CompaniesStateProvider>{children}</CompaniesStateProvider>
);

export default DashboardLayout;
