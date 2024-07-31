"use client";

import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServerActionResponse } from "@/types/types";
import { useTransition, useState } from "react";
import { useAlerts } from "@/state/alerts.state";

type UseFormActionProps<T extends Record<string, any>> = {
  schema: z.ZodType<any, any>;
  action: (inputs: T) => Promise<ServerActionResponse<T>>;
  onSuccess?: () => void;
  onError?: () => void;
  defaultValues?: DefaultValues<T>;
};

export function useFormAsync<T extends Record<string, any>>({
  schema,
  onSuccess,
  onError,
  action,
  defaultValues,
}: UseFormActionProps<T>) {
  const { addAlert } = useAlerts();
  const [pending, startTransaction] = useTransition();
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
        const results = await action(data);
        if (results.success) {
          setIsSubmitSuccessful(true);
          reset();
          if (onSuccess) onSuccess();
        } else {
          const { formErrors, message } = results;
          if (formErrors) {
            formErrors.forEach(({ field, message }) => {
              // @ts-ignore
              setError(field, { message });
            });
          }
          if (message)
            addAlert({
              title: "Error",
              text: message,
              type: "error",
            });
          if (onError) onError();
        }
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
    pending,
    handleSubmit,
    isSubmitSuccessful,
  };
}
