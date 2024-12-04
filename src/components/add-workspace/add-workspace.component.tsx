"use client";

import { FC, useEffect, useState, useRef } from "react";

import {
  createWorkspaceSchema,
  AddWorkspaceFormInputs,
} from "@/schemas/workspace.schema";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaces } from "@/state";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceType } from "@prisma/client";
import { beautifyEnumTerm } from "@/lib/beautify-enums";

type AddEmployeeProps = {
  children: React.ReactNode;
};

const AddWorkspace: FC<AddEmployeeProps> = ({ children }) => {
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const { addWorkspace } = useWorkspaces();
  const [open, setOpen] = useState(false);
  const form = useForm<AddWorkspaceFormInputs>({
    resolver: zodResolver(createWorkspaceSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      type: "INCOMING",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    reset,
  } = form;

  const onSubmit = async (inputs: AddWorkspaceFormInputs) => {
    try {
      const { success, formErrors, message } = await addWorkspace(inputs);

      if (success) {
        return setOpen(false);
      } else {
        if (formErrors) {
          formErrors.forEach(({ field, message }) => {
            setError(field, {
              type: "server",
              message,
            });
          });
        }
        if (message) {
          setError("root", {
            type: "server",
            message,
          });
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Set a general form error
      setError("root", {
        type: "server",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!isSubmitting) setOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent ref={dialogContentRef}>
        <DialogHeader className="mb-2">
          <DialogTitle>Add New Workspace</DialogTitle>
          <DialogDescription>
            A workspace is a logical grouping of audits. Statistics and
            management reports are generated at a workspace level. See
            documentation for additional information.
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name *</FormLabel>
                  <FormControl>
                    <Input
                      id="name-input"
                      {...field}
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription>
                    This is the display name for the workspace.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Type *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a workspace type." />
                    </SelectTrigger>
                    <SelectContent container={dialogContentRef.current}>
                      <SelectItem value={WorkspaceType.INCOMING}>
                        {beautifyEnumTerm(WorkspaceType.INCOMING)}
                      </SelectItem>
                      <SelectItem value={WorkspaceType.OUTGOING}>
                        {beautifyEnumTerm(WorkspaceType.OUTGOING)}
                      </SelectItem>
                      <SelectItem value={WorkspaceType.INTERNAL}>
                        {beautifyEnumTerm(WorkspaceType.INTERNAL)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type is used by the application to set certain defaults
                    and behaviors. See documentation for additional information.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="italic text-sm text-zinc-500">* Required</div>
            {form.formState.errors.root && (
              <div className="form-error text-red-500 text-sm font-semibold">
                {form.formState.errors.root.message}
              </div>
            )}
            <div className="w-full flex justify-end gap-4 pt-4">
              <Button
                variant="ghost"
                type="button"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="add" size="sm">
                {isSubmitting ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <span className="">Adding</span>
                  </>
                ) : (
                  "Add Workspace"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkspace;
