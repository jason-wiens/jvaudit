import { Suspense } from "react";
import Loading from "./loading";

import { CompanyStateProvider } from "@/state";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <CompanyStateProvider>{children}</CompanyStateProvider>
    </Suspense>
  );
}
