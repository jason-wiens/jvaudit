import React, { useState, FormEvent, useRef, useEffect } from "react";

import { useAlerts } from "@/state";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Loader2, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type EditableFieldError = {
  validationError?: string;
  errorMsg?: string;
};

export interface EditableFieldProps
  extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  currentValue: string;
  handleSubmit: (value: string) => Promise<EditableFieldError | void>;
  children?: React.ReactNode;
}

const EditableField = React.forwardRef<HTMLDivElement, EditableFieldProps>(
  (
    { name, currentValue, handleSubmit, className, children, ...props },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editableField, setEditableField] = useState(currentValue);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { addAlert } = useAlerts();

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current?.select();
      }
    }, [isEditing, inputRef]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);
      const response = await handleSubmit(editableField);

      // check for validation errors
      if (response?.validationError) {
        setErrorMsg(response.validationError);
        setIsSaving(false);
        return;
      }

      // check for general error
      if (response?.errorMsg) {
        addAlert({
          type: "error",
          title: "Error",
          message: response.errorMsg,
        });
        handleCancel();
        return;
      }

      addAlert({
        type: "success",
        title: "Success",
        message: `${name} updated successfully`,
      });
      setIsEditing(false);
    };

    const startEditing = () => {
      setIsEditing(true);
      setErrorMsg("");
      setIsSaving(false);
    };

    const handleCancel = () => {
      setEditableField(currentValue);
      setIsEditing(false);
      setIsSaving(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    useEffect(() => {
      if (isEditing) {
        document.addEventListener("keydown", handleEscape);
      } else {
        document.removeEventListener("keydown", handleEscape);
      }
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isEditing]);

    return (
      <>
        {isEditing ? (
          <form onSubmit={onSubmit}>
            <div className="flex gap-4 items-center min-h-[28px]">
              <label htmlFor={name}>{children}</label>
              <div className="">
                <input
                  type="text"
                  name={name}
                  className={cn(
                    "border-b outline-none selection:bg-zinc-200 selection:text-primary-900",
                    errorMsg
                      ? "border-red-500 selection:text-red-500 text-red-500"
                      : "border-zinc-300",
                    className
                  )}
                  value={editableField}
                  onChange={(e) => {
                    setEditableField(e.target.value);
                    setErrorMsg("");
                  }}
                  disabled={isSaving}
                  {...props}
                  ref={inputRef}
                />
              </div>
              {isSaving ? (
                <Loader2 size="20px" className="text-zinc-300 animate-spin" />
              ) : (
                <div className="flex gap-1">
                  <Button type="submit" variant="green" size="sm">
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            {errorMsg && <div className="text-red-500">{errorMsg}</div>}
          </form>
        ) : (
          <div className="flex gap-4 min-h-[28px] items-center">
            {children}
            <p className={cn("", className)} ref={ref}>
              {editableField}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Pencil
                    size="10px"
                    onClick={startEditing}
                    className="text-zinc-300 self-start"
                  />
                </TooltipTrigger>
                <TooltipContent>{`Edit ${name}`}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </>
    );
  }
);
EditableField.displayName = "EditableField";

export default EditableField;
