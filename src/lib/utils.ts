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
    // @ts-ignore
    if (formErrors[key] && key !== "_errors") {
      errors.push({
        field: key as keyof T,
        // @ts-ignore
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

type RemoveUndefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

export function cleanUndefinedFields<T extends Record<string, any>>(
  obj: T
): RemoveUndefined<T> {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj as RemoveUndefined<T>;
}

export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(uuid: string): boolean {
  return uuidRegex.test(uuid);
}

export function capitalize(str: string) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getNextAvailableInteger(arr: number[]): number {
  if (arr.length === 0) {
    return 1;
  }

  const sortedArr = arr.sort((a, b) => a - b);
  for (let i = 0; i < sortedArr.length; i++) {
    if (sortedArr[i] !== i + 1) {
      return i + 1;
    }
  }
  return sortedArr.length + 1;
}

export function formatNumber(num: number): string {
  if (isNaN(num)) {
    return "Invalid number";
  }

  // Round to two decimal places
  const roundedNumber = num.toFixed(2);

  // Insert commas for thousand separators
  const n = roundedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  console.log({ n });
  return n;
}

export function generateStrongPassword(length: number = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  const allCharacters = uppercase + lowercase + numbers + specialCharacters;

  let password = "";

  // Ensure password has at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Fill the rest of the password length with random characters
  for (let i = 4; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password to avoid predictable patterns
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
}
