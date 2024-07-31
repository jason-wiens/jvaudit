import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";
import type { FormError } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function serializeZodError<T extends Record<string, any> = {}>(
  zodError: ZodError<T>
): FormError<T>[] {
  const errors: FormError<T>[] = [];

  const formErrors = zodError.format();

  Object.keys(formErrors).forEach((key) => {
    if (formErrors[key] && key !== "_errors") {
      errors.push({
        field: key as keyof T,
        message: formErrors[key]!._errors.join(" and "),
      });
    }
  });

  return errors;
}

export function generateRandomId(length: number = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function cleanUndefinedFields(obj: Record<string, any>) {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
}

export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
