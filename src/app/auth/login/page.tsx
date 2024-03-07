"use client";

import { useFormAction } from "@/hooks/use-form-action.hook";
import { loginSchema, LoginFormInputs } from "@/schemas/login.schema";
import { login } from "@/actions/auth/login";

import { Logo } from "@/components/logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";

export default function LoginPage() {
  const { register, handleSubmit, errors, pending } =
    useFormAction<LoginFormInputs>({
      schema: loginSchema,
      action: login,
    });

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-full max-w-sm">
        <div className="p-8 bg-white rounded-md shadow-dark3 min-w-[400px]">
          <div className="">
            <div className="flex justify-center font-bold text-4xl mb-12">
              <Logo classes="text-4xl" />
            </div>
            {(!!errors.username || !!errors.password) && (
              <h3 className="text-red-500 text-center mb-6">
                Invalid Login Attempt
              </h3>
            )}
          </div>
          <form action={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="username" className="">
                Username
              </Label>
              <Input
                id="username"
                {...register("username")}
                disabled={pending}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="">
                Password
              </Label>
              <Input
                id="password"
                {...register("password")}
                type={"password"}
                disabled={pending}
              />
            </div>
            <div className="w-full mt-16 flex justify-center">
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <span className="italic">Logging In...</span>
                  </>
                ) : (
                  "Login"
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
