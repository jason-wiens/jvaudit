import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServerActionResponse } from "@/types/types";
import { useTransition, useState } from "react";

type UseFormActionProps<T extends Record<string, any>> = {
  schema: z.ZodType<any, any>;
  action: (inputs: T) => Promise<ServerActionResponse<T>>;
  onSuccess?: () => void;
  onError?: () => void;
};

export function useFormAction<T extends Record<string, any>>({
  schema,
  onSuccess,
  onError,
  action,
}: UseFormActionProps<T>) {
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
  });

  const handleSubmit = () =>
    startTransaction(async () => {
      const validationResults = trigger();
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
          if (message) {
            //TODO: add toast
            console.log(message);
          }
          if (onError) onError();
        }
      } catch (error) {
        //TODO: add toast
        console.error(error);
      }
    });

  return {
    register,
    errors,
    pending,
    handleSubmit,
    isSubmitSuccessful,
  };
}
