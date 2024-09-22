"use client";

import { useState } from "react";
import { Logo } from "@components/logo";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Textarea } from "../ui/textarea";
import { ReloadIcon } from "@radix-ui/react-icons";
import { addSubscriber } from "@/state/public/actions/addMarketingSubscriber";
import {
  subscriberSchema,
  SubscriberFormInputs,
} from "@schemas/subscriber.schema";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useFormAsync } from "@/hooks/use-form-async.hook";

export function Subscribe({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, errors, pending, isSubmitSuccessful, reset } =
    useFormAsync<SubscriberFormInputs>({
      schema: subscriberSchema,
      action: addSubscriber,
      onSuccess: () => {
        setOpen(false);
      },
    });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      reset();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl mb-3 pt-2">
            Subscribe / Contact Us
          </DialogTitle>
          <DialogDescription>
            Please fill out the form below and we will send you periodic updates
            on our progress. We will never share your information with anyone.
            If you would like to know more about jvaudit.io please indicate so
            in the comment section andy we will reach out to you as soon as
            posible. Thanks!
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <form
          className="w-full max-w-md flex flex-col gap-2"
          action={handleSubmit}
        >
          <div className="space-y-1">
            <Label htmlFor="name" className="">
              Name *
            </Label>
            <Input id="name" {...register("name")} disabled={pending} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="">
              Email *
            </Label>
            <Input id="email" {...register("email")} disabled={pending} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="company" className="">
              Company *
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
          <p className="italic text-zinc-800 text-sm">* Required</p>
          <div className="flex gap-2 justify-end pt-8">
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="add" size="sm">
              {pending ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  <span className="">Sending...</span>
                </>
              ) : (
                "Subscribe / Send"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
