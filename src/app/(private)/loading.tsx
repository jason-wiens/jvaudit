import React from "react";

import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen w-full h-1">
      <Header loading />
      <div className="flex w-full h-full relative">
        <div className="w-56">
          <div className="bg-zinc-50 h-full w-full border-r border-zinc-200">
            <div className="w-full px-6 h-14 border-b border-zinc-200 flex gap-2 items-center">
              <Building2 size={16} />
              <Skeleton className="w-20 h-4" />
            </div>
          </div>
        </div>
        <div className="flex-1 h-full p-8"></div>
      </div>
    </div>
  );
};

export default Loading;
