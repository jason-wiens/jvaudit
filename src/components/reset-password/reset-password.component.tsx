"use client";

import { FC, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

import { RefreshCcw, TriangleAlert, UserCheck } from "lucide-react";
import { User } from "@/state/users/types";
import { useAlerts, useUsers, useCurrentUser } from "@/state";
import { ReloadIcon } from "@radix-ui/react-icons";

type ResetPasswordProps = {
  user: User;
};

const ResetPassword: FC<ResetPasswordProps> = ({ user }) => {
  const { resetPassword } = useUsers();
  const [pending, setPending] = useState(false);
  const { addAlert } = useAlerts();
  const [open, setOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const { currentUser } = useCurrentUser();

  if (currentUser?.userId === user.userId)
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="disabled:cursor-not-allowed"
      >
        <RefreshCcw size={16} className="" />
      </Button>
    );

  const closeDialog = () => {
    setOpen(false);
    setTempPassword(null);
  };

  const handleResetPassword = async () => {
    setPending(true);
    try {
      const { success, data, message } = await resetPassword({
        userId: user.userId,
      });

      if (success && data) {
        setTempPassword(data.password);
      } else {
        addAlert({
          title: "Error Resetting Password",
          message: message
            ? `${message}. Please try again.`
            : "Please try again",
          type: "error",
        });
        closeDialog();
      }
    } catch (error) {
      console.error(error);
      addAlert({
        title: "Error Resetting Password",
        message: "Please try again",
        type: "error",
      });
      closeDialog();
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTempPassword(null);
        }
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <RefreshCcw size={16} className="" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Password</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {!!tempPassword ? (
        <DialogContent className="w-[450px]">
          <DialogClose />
          <DialogHeader>
            <DialogTitle className="text-green-500 flex items-center gap-2">
              <UserCheck />{" "}
              {`You have successfully reset the password for ${user.username}`}.
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">
            Please provide the following temporary password to the user. They
            will be prompted to change it upon their next login.
          </DialogDescription>
          <div className="font-semibold border border-zinc-200 py-2 px-4 mb-2 rounded">
            {tempPassword}
          </div>
          <DialogDescription className="flex gap-2 items-start text-base">
            <TriangleAlert className="text-yellow-500" />
            <p>
              <span className="font-semibold text-primary-900">
                Please copy this password now.
              </span>{" "}
              Once you close this dialog box the password will be hidden and you
              will not be able to access it anymore.
            </p>
          </DialogDescription>
          <div className="flex justify-end">
            <Button size="sm" onClick={closeDialog} variant="green">
              Done
            </Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogClose />
            <DialogTitle className="text-red-500 w-[300px] flex items-center pb-4">
              <TriangleAlert className="mr-2" size={24} />
              {`WARNING!`}
            </DialogTitle>
            <DialogDescription className="text-base text-primary-900">
              Are you sure you want to reset the password for{" "}
              <span className="text-lg font-bold">{user.username}</span>. You
              will not be able to undo this action. Please proceed with caution
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleResetPassword}>
              {pending ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  <span className="italic">Resetting...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ResetPassword;
