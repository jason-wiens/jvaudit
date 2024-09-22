import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const badgeVariants = cva(
  "relative flex justify-start border-l-4  pl-3 pb-2 shadow-dark2 rounded min-w-48",
  {
    variants: {
      variant: {
        primary: "bg-primary-900/5 border-primary-900",
        secondary: "bg-secondary-500/20 border-secondary-500",
        accent: "bg-accent-500/10 border-accent-500",
        grey: "bg-zinc-50 border-zinc-500",
        green: "bg-green-500/10 border-green-500",
        yellow: "bg-yellow-500/20 border-yellow-500",
        red: "bg-red-500/10 border-red-500",
      },
      size: {
        sm: "text-xs",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const labelVariants = cva(
  "absolute left-2 bg-primary-900 font-bold  rounded-full",
  {
    variants: {
      variant: {
        primary: "bg-primary-900 text-white",
        secondary: "bg-secondary-500 text-white",
        accent: "bg-accent-500 text-white",
        grey: "bg-zinc-500 text-white",
        green: "bg-green-500 text-white",
        yellow: "bg-yellow-500 text-white",
        red: "bg-red-500 text-white",
      },
      size: {
        sm: "text-xs px-2 py-1 -top-2",
        md: "text-sm px-3 py-1 -top-3",
        lg: "text-base px-3 py-1 -top-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  label?: string;
  onDelete?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ onDelete, children, label, className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(
          badgeVariants({ variant, size }),
          className,
          onDelete ? "pr-10" : "pr-2",
          label ? "pt-6" : "pt-2"
        )}
        ref={ref}
        {...props}
      >
        {!!label && (
          <div className={cn(labelVariants({ variant, size }))}>{label}</div>
        )}
        {children}
        {!!onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete()}
            className="absolute right-0 top-0"
          >
            <X size={16} />
          </Button>
        )}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export default Badge;
