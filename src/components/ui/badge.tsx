import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80",
        primary:
          "border-transparent bg-primary-900 text-zinc-50 hover:bg-primary-500/80",
        secondary:
          "border-transparent bg-secondary-500/20 text-secondary-500 hover:bg-secondary-500/50",
        accent:
          "border-transparent bg-accent-500/20 text-accent-500 hover:bg-accent-500/50",
        green:
          "border-transparent bg-green-500 text-zinc-50 hover:bg-green-500/80",
        yellow:
          "border-transparent bg-yellow-500 text-zinc-50 hover:bg-yellow-500/80",
        destructive:
          "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80",
        outline: "text-zinc-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
