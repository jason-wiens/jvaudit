"use client";

import { Logo } from "@components/logo";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Textarea } from "../ui/textarea";
import { ReloadIcon } from "@radix-ui/react-icons";

import { subscriberSchema, SubscriberFormInputs } from "@schemas/subscriber";
import { addSubscriber } from "@/actions/addMarketingSubscriber";
import { useFormAction } from "@/hooks/use-form-action.hook";

export function Subscribe() {
  const { register, handleSubmit, errors, pending, isSubmitSuccessful } =
    useFormAction<SubscriberFormInputs>({
      schema: subscriberSchema,
      action: addSubscriber,
    });

  return (
    <div className="w-full flex flex-col justify-center items-center bg-gray-100 p-16">
      <div className="mb-8 text-center">
        <span className="font-bold">
          <Logo />
        </span>{" "}
        is currently in closed beta for invite only.
        <br />
        To follow our progress or to get on the beta waitlist please subscribe
        below:
      </div>
      {isSubmitSuccessful ? (
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-500">
            Thank you!
          </div>
          <div className="">We will be in touch soon.</div>
        </div>
      ) : (
        <form
          className="w-full max-w-md flex flex-col gap-2"
          action={handleSubmit}
        >
          <div className="space-y-1">
            <Label htmlFor="name" className="">
              Name
            </Label>
            <Input id="name" {...register("name")} disabled={pending} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="">
              Email
            </Label>
            <Input id="email" {...register("email")} disabled={pending} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="company" className="">
              Company
            </Label>
            <Input id="company" {...register("company")} disabled={pending} />
            {errors.company && (
              <p className="text-red-500 text-sm">{errors.company.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="comments" className="">
              Comments
            </Label>
            <Textarea
              id="comments"
              {...register("comments")}
              disabled={pending}
              rows={3}
            />
            {errors.comments && (
              <p className="text-red-500 text-sm">{errors.comments.message}</p>
            )}
          </div>
          <div className="flex justify-end mt-8">
            <Button type="submit" variant="accent">
              {pending ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
