import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Building2, Loader2 } from "lucide-react";

const sizes = {
  default: 20,
  sm: 16,
  md: 20,
  lg: 24,
};

const spinnerVariants = cva("", {
  variants: {
    variant: {
      default: "text-primary-900",
      grey: "text-zinc-500",
      green: "text-green-500",
      secondary: "bg-secondary-500",
      accent: "bg-accent-500",
    },
    size: sizes,
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    console.log(cn(spinnerVariants({ size })));
    return (
      <div
        className={cn(spinnerVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <Loader2 size={sizes[size || "default"]} className="animate-spin" />
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export default Spinner;
