import React, { Suspense, FC } from "react";
import Loading from "./loading";

type LayoutProps = {
  children: React.ReactNode;
};

const layout: FC<LayoutProps> = ({ children }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default layout;
