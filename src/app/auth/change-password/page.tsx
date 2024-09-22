"use client";

import { useFormAsync } from "@/hooks/use-form-async.hook";
import {
  changePasswordSchema,
  ChangePasswordFormInputs,
} from "@/schemas/login.schema";
import { changePassword } from "@/state/auth/actions/change-password";

import { Logo } from "@/components/logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const session = useSession();
  const router = useRouter();
  const { register, handleSubmit, errors, pending } =
    useFormAsync<ChangePasswordFormInputs>({
      schema: changePasswordSchema,
      action: changePassword,
      onSuccess: () => router.push(AppRoutes.AppPage()),
    });

  // TODO: Implement the handleSubmit function that enforces strong password requirements
  // and clients side validation outside the useFormAsync hook.

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-full max-w-sm">
        <div className="p-8 bg-white rounded-md shadow-dark3 min-w-[400px]">
          <div className="flex justify-center font-bold text-4xl">
            <Logo classes="text-4xl" />
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Lock size={16} />
            <p className="my-6 text-center">Please change your password.</p>
          </div>
          <form action={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="currentPassword" className="">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type={"password"}
                {...register("currentPassword")}
                disabled={pending}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword" className="">
                New Password
              </Label>
              <Input
                id="newPassword"
                {...register("newPassword")}
                type={"password"}
                disabled={pending}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                {...register("confirmPassword")}
                type={"password"}
                disabled={pending}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="w-full mt-16 flex justify-center">
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <span className="italic">Changing...</span>
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-80 h-[800px] bg-secondary-500/20 absolute left-1/2 top-1/2 -z-10 -translate-y-1/2"></div>
    </div>
  );
}
