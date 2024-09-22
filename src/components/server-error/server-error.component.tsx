"use client";

import React, { FC, useEffect } from "react";
import { useAlerts } from "@/state";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";

type ServerErrorProps = {
  message?: string;
  backurl?: string;
};

const ServerError: FC<ServerErrorProps> = ({
  message = "Unknown Error",
  backurl,
}) => {
  const { addAlert } = useAlerts();
  const router = useRouter();

  useEffect(() => {
    addAlert({
      title: "Server Error",
      message,
      type: "error",
    });
    if (!!backurl) {
      router.push(backurl);
    } else {
      router.push(AppRoutes.ServerError());
    }
  }, []);

  return <div>Server Error</div>;
};

export default ServerError;
