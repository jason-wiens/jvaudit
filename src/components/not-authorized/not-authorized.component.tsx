"use client";

import React, { useEffect } from "react";
import { useAlerts } from "@/state";
import { useRouter } from "next/router";

const NotAuthorized = () => {
  const { addAlert } = useAlerts();
  const router = useRouter();

  useEffect(() => {
    addAlert({
      title: "Not Authorized",
      text: "You are not authorized to view this page",
      type: "error",
    });
    router.back();
  }, []);

  return <div>NotAuthorized</div>;
};

export default NotAuthorized;
