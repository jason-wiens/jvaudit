"use client";

import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServerActionResponse } from "@/types/types";
import { useTransition, useState } from "react";
import { useAlerts } from "@/state/alerts.state";

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
  const [_, startTransaction] = useTransition();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    reset,
    setError,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = () =>
    startTransaction(async () => {
      const validationResults = await trigger();
      if (!validationResults) return;
      const data = getValues();

      try {
        // if optimistic action is provided, run it
        action(data);
        !!onSubmit && onSubmit();
        setIsSubmitSuccessful(true);
        return;
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Error. Please try again.",
          text: "Check the console for more information.",
          type: "error",
        });
      }
    });

  return {
    reset,
    register,
    errors,
    handleSubmit,
    isSubmitSuccessful,
  };
}
