"use client";

import { useFormAsync } from "@/hooks/use-form-async.hook";
import { loginSchema, LoginFormInputs } from "@/schemas/login.schema";
import { login } from "@/state/auth/actions/login";

import { Logo } from "@/components/logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes.app";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, errors, pending } =
    useFormAsync<LoginFormInputs>({
      schema: loginSchema,
      action: login,
      onSuccess: () => router.push(AppRoutes.AppPage()),
    });

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-full max-w-sm">
        <div className="p-8 bg-white rounded-md shadow-dark3 min-w-[400px]">
          <div className="">
            <div className="flex justify-center font-bold text-4xl mb-12">
              <Link href={AppRoutes.HomePage()}>
                <Logo classes="text-4xl" />
              </Link>
            </div>
          </div>
          <form action={handleSubmit} className="">
            <div className="space-y-1 mb-4">
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
            {(!!errors.username || !!errors.password) && (
              <h3 className="text-red-500 mt-2">
                Invalid Login Attempt. This may be the result of an incorrect
                username / password combination, or your account is set to
                inactive. Please contact your administrator for additional
                details.
              </h3>
            )}
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
