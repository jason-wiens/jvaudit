import { SessionProvider } from "next-auth/react";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@styles/globals.css";
import { AlertContextProvider } from "@/state";

const inter = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "jvAudit.io",
  description: "A Joint Venture Audit Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-zinc-900 text-base`}>
        <SessionProvider>
          <AlertContextProvider>{children}</AlertContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
