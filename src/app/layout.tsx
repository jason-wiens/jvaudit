import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";

import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
        {children}
      </body>
    </html>
  );
}
