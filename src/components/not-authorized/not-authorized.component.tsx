"use client";

import React, { useEffect } from "react";
import { useAlerts } from "@/state";
import { useRouter } from "next/router";
import { AppRoutes } from "@/lib/routes.app";

const NotAuthorized = () => {
  const { addAlert } = useAlerts();
  const router = useRouter();

  useEffect(() => {
    addAlert({
      title: "Not Authorized",
      message: "You are not authorized to view this page",
      type: "error",
    });
    router.push(AppRoutes.Forbidden());
  }, []);

  return <div>NotAuthorized</div>;
};

export default NotAuthorized;
