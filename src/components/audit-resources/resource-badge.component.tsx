import React from "react";

import { Badge } from "../badge";
import type { Resource } from "@/state/audit/types";
import { ResourceType } from "@prisma/client";
import { beautifyEnumTerm } from "@/lib/beautify-enums";

type ResourceBadgeProps = {
  resource: Resource;
  onDelete?: (resourceId: string) => void;
};

export const ResourceBadge: React.FC<ResourceBadgeProps> = ({
  resource,
  onDelete,
}) => {
  const {
    resourceId,
    type,
    employee: {
      personalProfile: { firstName, lastName, email },
    },
  } = resource;

  const variantType = (r: ResourceType) => {
    switch (r) {
      case ResourceType.AUDITOR:
        return "primary";
      case ResourceType.AUDIT_CONTACT_OPERATOR:
        return "accent";
      default:
        return "secondary";
    }
  };

  return (
    <Badge
      onDelete={() => !!onDelete && onDelete(resourceId)}
      label={beautifyEnumTerm(type)}
      variant={variantType(type)}
    >
      <div className="w-1 h-full bg-secondary-500"></div>
      <div className="">
        <div className="font-bold">{`${firstName} ${lastName}`}</div>
        <div className="text-sm">{email}</div>
      </div>
    </Badge>
  );
};
ResourceBadge.displayName = "Badge";
