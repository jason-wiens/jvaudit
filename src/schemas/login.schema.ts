import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .min(1, { message: "Current Password is required" }),
  newPassword: z
    .string()
    .trim()
    .min(1, { message: "New Password is required" }),
  confirmPassword: z
    .string()
    .trim()
    .min(1, { message: "Confirm Password is required" }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
export type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;
