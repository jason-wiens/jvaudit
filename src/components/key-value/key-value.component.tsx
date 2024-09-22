import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import s from "./styles.module.css";

export type KeyValueData = {
  label: string;
  labelDescription?: string;
  values: React.ReactNode[];
};

const keyValueVariants = cva("", {
  variants: {
    variant: {
      default: "text-primary-900",
    },
    size: {
      default: "p-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface KeyValueProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof keyValueVariants> {
  data: KeyValueData[];
}

const KeyValue = React.forwardRef<HTMLDivElement, KeyValueProps>(
  ({ data, className, variant, size, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-4">
        {data.map((item, index) => (
          <div className="border-b border-zinc-200 pb-4 flex">
            <div className="w-1/3 border-r border-zinc-200 pr-8" key={index}>
              <h2 className=" text-lg text-secondary-500">{item.label}</h2>
              <p className="text-zinc-500 text-sm italic">
                {item.labelDescription}
              </p>
            </div>
            <div
              className="flex-1 pl-8 flex flex-col gap-4 items-start"
              key={100 + index}
            >
              {item.values}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default KeyValue;
