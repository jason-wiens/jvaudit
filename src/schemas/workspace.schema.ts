import { z } from "zod";

export const createWorkspaceSchema = z.object({
  type: z.enum(["INCOMING", "OUTGOING", "INTERNAL"]),
  name: z
    .string()
    .min(3, "A workspace name must be at least 3 characters long"),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, "A workspace name must be at least 3 characters long")
    .optional(),
});

export type AddWorkspaceFormInputs = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceFormInputs = z.infer<typeof updateWorkspaceSchema>;
