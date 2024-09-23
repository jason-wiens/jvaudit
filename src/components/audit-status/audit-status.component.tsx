"use client";

import React, { useState, useEffect } from "react";

import { AuditStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/state";

type AuditStatusProps = {
  status: AuditStatus;
  auditId: string;
};

const AuditStatusComponent: React.FC<AuditStatusProps> = ({
  status,
  auditId,
}) => {
  return <div className="">Needs Work</div>;
  // const progression = {
  //   [AuditStatus.CREATED]: 0,
  //   [AuditStatus.CONFIRMED]: 1,
  //   [AuditStatus.FIELDWORK]: 3,
  //   [AuditStatus.REPORTING]: 4,
  //   [AuditStatus.SUBMITTED]: 5,
  //   [AuditStatus.RESPONSE]: 6,
  //   [AuditStatus.CLOSED]: 7,
  //   [AuditStatus.CANCELLED]: 8,
  // };
  // const [pending, setPending] = useState(false);
  // const { addAlert } = useAlerts();
  // const [currentStatus, setCurrentStatus] = useState<number>(
  //   progression[status]
  // );
  // const statusItems: {
  //   status: AuditStatus;
  //   name: string;
  //   completed: boolean;
  //   active: boolean;
  // }[] = [
  //   {
  //     status: AuditStatus.CREATED,
  //     name: "Created",
  //     completed: progression[AuditStatus.CREATED] <= currentStatus,
  //     active: false,
  //   },
  //   {
  //     status: AuditStatus.CONFIRMED,
  //     name: "Confirmed",
  //     completed: progression[AuditStatus.CONFIRMED] < currentStatus,
  //     active: currentStatus === progression[AuditStatus.CONFIRMED],
  //   },
  //   {
  //     status: AuditStatus.FIELDWORK,
  //     name: "Fieldwork",
  //     completed: progression[AuditStatus.FIELDWORK] < currentStatus,
  //     active: currentStatus === progression[AuditStatus.FIELDWORK],
  //   },
  //   {
  //     status: AuditStatus.REPORTING,
  //     name: "Report Preperation",
  //     completed: progression[AuditStatus.REPORTING] < currentStatus,
  //     active: currentStatus === progression[AuditStatus.REPORTING],
  //   },
  //   {
  //     status: AuditStatus.SUBMITTED,
  //     name: "Report Submission",
  //     completed: progression[AuditStatus.SUBMITTED] < currentStatus,
  //     active: currentStatus === progression[AuditStatus.SUBMITTED],
  //   },
  //   {
  //     status: AuditStatus.RESPONSE,
  //     name: "Responses & Rebuttal",
  //     completed: progression[AuditStatus.RESPONSE] < currentStatus,
  //     active: currentStatus === progression[AuditStatus.RESPONSE],
  //   },
  //   {
  //     status: AuditStatus.CLOSED,
  //     name: "Completion",
  //     completed: progression[AuditStatus.CLOSED] < currentStatus,
  //     active: currentStatus === progression[AuditStatus.CLOSED],
  //   },
  // ];

  // useEffect(() => {
  //   setCurrentStatus(progression[status]);
  // }, [status]);

  // const handleStatusChange = async (status: AuditStatus) => {
  //   if (pending) return;

  //   setPending(true);
  //   const oldStatus = status;
  //   setCurrentStatus(progression[status]);

  //   const { success } = await updateAudit({
  //     auditId,
  //     auditData: { status: status as AuditStatus },
  //   });

  //   if (!success) {
  //     setCurrentStatus(progression[oldStatus]);
  //     addAlert({
  //       title: "Error",
  //       text: "Failed to update audit status",
  //       type: "error",
  //     });
  //   }

  //   setPending(false);
  // };

  // return (
  //   <div className="w-full flex justify-between relative">
  //     {statusItems.map((item, index) => (
  //       <div
  //         className={cn(
  //           "flex flex-col items-center gap-2 w-20 relative z-20",
  //           !pending && "cursor-pointer"
  //         )}
  //         key={index}
  //         onClick={() => handleStatusChange(item.status)}
  //       >
  //         {item.active ? (
  //           <div className="relative flex h-3 w-3">
  //             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-500 opacity-75"></span>
  //             <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-500"></span>
  //           </div>
  //         ) : (
  //           <div
  //             className={cn(
  //               "rounded-full ",
  //               item.completed
  //                 ? "bg-secondary-500 h-3 w-3"
  //                 : "bg-zinc-200 h-3 w-3"
  //             )}
  //           ></div>
  //         )}
  //         <p className={cn("text-sm text-center", item.active && "font-bold")}>
  //           {item.name}
  //         </p>
  //       </div>
  //     ))}
  //     <div className="absolute w-full px-[40px] top-[5px]">
  //       <div className="relative w-full flex">
  //         {Array.from(
  //           { length: statusItems.length - 1 },
  //           (_, index) => index
  //         ).map((index) => (
  //           <div
  //             key={index}
  //             className={cn(
  //               "h-[2px] w-[14.3%]",
  //               index < currentStatus ? "bg-secondary-500" : "bg-zinc-200"
  //             )}
  //           ></div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default AuditStatusComponent;
