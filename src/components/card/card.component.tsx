import React, { FC } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ title, className, children, ...prop }, ref) => {
    return (
      <div className="bg-inherit">
        {title && (
          <div className="text-sm text-zinc-500 pl-1 mb-[2px]">{title}</div>
        )}
        <div
          className={cn(
            "p-4 bg-white rounded-md border border-zinc-200 shadow-sm",
            className
          )}
          ref={ref}
          {...prop}
        >
          {children}
        </div>
      </div>
    );
  }
);
Card.displayName = "Card";

export default Card;
