import { useParams } from "next/navigation";

export const useStringParam = (paramName: string): string => {
  const params = useParams();

  if (Array.isArray(params)) {
    throw new Error(
      `Expected param ${paramName} to be a string, but received an array.`
    );
  }

  return params[paramName] as string;
};
