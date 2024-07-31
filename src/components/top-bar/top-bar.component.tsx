import { cn } from "@/lib/utils";
import React, { FC } from "react";

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full h-14 px-6 bg-white border-b border-zinc-200 flex items-center",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

export default TopBar;
