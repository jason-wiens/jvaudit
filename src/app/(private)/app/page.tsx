"use client";

import React, { useEffect } from "react";
import { useWorkspace } from "@/state";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";

const AppPage = () => {
  const { workspace } = useWorkspace();
  const router = useRouter();

  useEffect(() => {
    if (!workspace) return;
    router.push(AppRoutes.Dashboard({ workspaceId: workspace.workspaceId }));
  }, [workspace]);

  return <></>;
};

export default AppPage;
