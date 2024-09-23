import React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { User } from "next-auth/types";
import { Person } from "@prisma/client";

const avatarVariants = cva(
  "rounded-full flex items-center justify-center overflow-hidden uppercase font-semibold",
  {
    variants: {
      variant: {
        light: "bg-zinc-100 text-secondary-500",
        dark: "bg-primary-900 text-white",
        secondary: "bg-secondary-500 text-white",
        fancy: "bg-primary-900 text-white",
      },
      size: {
        sm: "h-6 w-6 text-sm",
        md: "h-8 w-8 text-base",
        lg: "h-10 w-10 text-lg",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "light",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  user:
    | User
    | (Person & { avatarUrl?: never })
    | {
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl?: string;
      };
  className?: string;
  showDetails?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ user, variant, size, className, showDetails = false, ...props }, ref) => {
    if (!user)
      return (
        <div
          className={cn(avatarVariants({ size }), "bg-zinc-500 animate-pulse")}
          ref={ref}
          {...props}
        ></div>
      );

    return (
      <div className="flex gap-2 items-center">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={`${user.firstName} ${user.lastName}'s Avatar`}
            width={24}
            height={24}
            className={cn(avatarVariants({ size, variant }), className)}
            {...props}
          />
        ) : (
          <div
            className={cn(avatarVariants({ size, variant }), className)}
            ref={ref}
            {...props}
          >
            <span className={variant === "fancy" ? "text-secondary-500" : ""}>
              {user.firstName.charAt(0)}
            </span>
            {user.lastName.charAt(0)}
          </div>
        )}
        {showDetails && (
          <div className="flex flex-col">
            <div className="font-semibold">
              {`${user.firstName} ${user.lastName}`}
            </div>
            <div className="text-sm text-zinc-500">{user.email}</div>
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export default Avatar;
