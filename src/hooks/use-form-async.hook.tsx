"use client";

import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServerActionResponse } from "@/types/types";
import { useTransition, useState } from "react";
import { useAlerts } from "@/state";

type UseFormActionProps<
  Input extends Record<string, any>,
  Data extends Record<string, any> | void = void
> = {
  schema: z.ZodType<any, any>;
  action: (inputs: Input) => Promise<ServerActionResponse<Input, Data>>;
  onSuccess?: (data: Data) => void;
  onError?: () => void;
  defaultValues?: DefaultValues<Input>;
};

export function useFormAsync<
  Input extends Record<string, any>,
  Data extends Record<string, any> | void = void
>({
  schema,
  onSuccess,
  onError,
  action,
  defaultValues,
}: UseFormActionProps<Input, Data>) {
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
  } = useForm<Input>({
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
          if (onSuccess) {
            onSuccess(results.data || ({} as Data));
          }
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
              message: message,
              type: "error",
            });
          if (onError) onError();
        }
      } catch (error) {
        console.error(error);
        addAlert({
          title: "Error. Please try again.",
          message: "Check the console for more information.",
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
