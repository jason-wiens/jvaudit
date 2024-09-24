import { FC } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignoutButton from "./sign-out.component";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Skeleton } from "../ui/skeleton";
import { DefaultIcons } from "@/lib/default-icons";
import { AppRoutes } from "@/lib/routes.app";
import { checkAuthorized } from "@/permissions";

type HeaderAppProps = {};

const HeaderApp: FC<HeaderAppProps> = async () => {
  const session = await checkAuthorized();

  if (!session) {
    return (
      <header className="w-full flex justify-between items-center px-6 py-2 bg-primary-900">
        <Logo variant="white" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>
    );
  }

  // if (status === "unauthenticated" || !session) {
  //   // User is not authenticated, show sign-in option or skeleton
  //   return (
  //     <header className="w-full flex justify-between items-center px-6 py-2 bg-primary-900">
  //       <Logo variant="white" />
  //       {/* You can add a sign-in button here if desired */}
  //       <Skeleton className="h-8 w-8 rounded-full" />
  //     </header>
  //   );
  // }

  const { firstName, lastName, email } = session?.user;

  return (
    <header className="w-full flex justify-between items-center px-6 py-2 bg-primary-900">
      <Logo variant="white" />
      {!!session && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={session.user.avatarUrl || undefined} />
              <AvatarFallback className="uppercase">{`${firstName[0]}${lastName[0]}`}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{`${firstName} ${lastName}`}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2 items-center justify-start cursor-pointer"
              asChild
            >
              <Link href={AppRoutes.UserSettings()}>
                {DefaultIcons.Settings()}
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2 items-center justify-start cursor-pointer"
              asChild
            >
              <Link href={AppRoutes.UserNotifications()}>
                {DefaultIcons.Notifications()}
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-2 items-center justify-start cursor-pointer">
              <SignoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default HeaderApp;
