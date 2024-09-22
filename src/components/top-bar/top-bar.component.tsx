import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

export type Crumb = {
  icon?: React.ReactNode;
  label: string;
  href?: string;
};

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  crumbs?: Crumb[];
}

const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(
  ({ crumbs, children, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full h-14 px-6 bg-white border-b border-zinc-200 flex items-center justify-between",
          className
        )}
        ref={ref}
        {...props}
      >
        {!!crumbs && crumbs.length > 0 && (
          <ul className="flex gap-2 items-center">
            {crumbs.map((crumb, index) => (
              <li key={index}>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-secondary-500 flex items-center gap-2"
                  >
                    {crumb.icon}
                    {crumb.label}
                    {index < crumbs.length - 1 && <span className="">/</span>}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">
                    {crumb.icon}
                    {crumb.label}
                    {index < crumbs.length - 1 && <span className="">/</span>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    );
  }
);

export default TopBar;
