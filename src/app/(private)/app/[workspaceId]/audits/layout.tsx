import { UserAuditsState } from "@/state";

import { Suspense } from "react";
import Loading from "./loading";

export default async function AuditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
