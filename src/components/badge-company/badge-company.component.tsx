import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { Company, Employee, Person } from "@prisma/client";

const badgeVariants = cva("px-6 py-2 rounded-full flex items-center gap-2", {
  variants: {
    variant: {
      default: "bg-secondary-500/20 text-secondary-500",
      grey: "bg-zinc-200 text-zinc-900",
      green: "bg-green-500/20 text-green-500",
      primary: "bg-primary-500 text-white",
    },
    size: {
      default: "text-sm",
      sm: "text-xs",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  company: Company & { employees: (Employee & { personalProfile: Person })[]}
}

const BadgCompany = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ company, className, variant, size, ...props }, ref) => {
    const { fullLegalName, employees } = company;
    const primaryContact = employees.find(e => e.primaryContact)

    return (
      <div className="flex justify-start">
        <div
          className={cn(badgeVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <Building2 className="w-7 h-7" />
          <div>
            <div className="text-inherit font-bold">{fullLegalName}</div>
            <div className="">
              Primary Contact: {primaryContact?.personalProfile.firstName || ""}{" "}
              {primaryContact?.personalProfile.lastName}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
BadgCompany.displayName = "Badge";

export default BadgCompany;
