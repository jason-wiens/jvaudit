import { z } from "zod";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.schema";
import { createPersonSchema, updatePersonSchema } from "./person.schema";

export const createUserSchema = createEmployeeSchema.merge(
  createPersonSchema.merge(
    z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
    })
  )
);

export const updateUserSchema = updateEmployeeSchema.merge(
  updatePersonSchema.merge(
    z.object({
      admin: z.boolean().optional(),
      avatarUrl: z.string().optional(),
    })
  )
);

export type AddUserFormInputs = z.infer<typeof createUserSchema>;
export type UpdateUserFormInputs = z.infer<typeof updateUserSchema>;
