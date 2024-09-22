"use client";

import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { useAlerts } from "@/state";

type UseFormOptimisticActionProps<T extends Record<string, any>> = {
  schema: z.ZodType<any, any>;
  action: (inputs: T) => void;
  onSubmit?: () => void;
  defaultValues?: DefaultValues<T>;
};

export function useFormOptimistic<T extends Record<string, any>>({
  schema,
  action,
  onSubmit,
  defaultValues,
}: UseFormOptimisticActionProps<T>) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // const handleSubmit = async () =>
  //   startTransaction(async () => {
  //     const validationResults = await trigger();
  //     if (!validationResults) return;

  //     try {
  //       action(getValues());
  //       !!onSubmit && onSubmit();
  //     } catch (error) {
  //       console.error(error);
  //       addAlert({
  //         title: "Error. Please try again.",
  //         message: "Check the console for more information.",
  //         type: "error",
  //       });
  //     }
  //   });

  const handleSubmit = async () => {
    const validationResults = await trigger();
    if (!validationResults) return;

    try {
      action(getValues());
      !!onSubmit && onSubmit();
    } catch (error) {
      console.error(error);
      addAlert({
        title: "Error. Please try again.",
        message: "Check the console for more information.",
        type: "error",
      });
    }
  };

  return {
    pending,
    reset,
    register,
    errors,
    handleSubmit,
  };
}
