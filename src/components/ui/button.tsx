import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-900 text-zinc-50 hover:bg-secondary-500 shadow-md hover:shadow-xl",
        destructive: "hover:bg-red-500/20 text-red-500",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900",
        secondary: "bg-secondary-500 text-zinc-100 hover:bg-secondary-500/80",
        ghost: "hover:bg-zinc-300 hover:text-zinc-900",
        ghostSecondary: "hover:bg-secondary-500/20 hover:text-secondary-900",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        accent: "bg-accent-500 text-zinc-50 hover:bg-accent-900",
        add: "bg-green-500 text-zinc-50 hover:bg-green-700",
        green: "bg-green-500 text-zinc-50 hover:bg-green-700",
        cancel: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
      },
      size: {
        default: "px-4 py-[6px] text-base",
        sm: "px-3 py-1 text-sm",
        lg: "h-11 rounded-md px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
