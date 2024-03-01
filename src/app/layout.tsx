import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@styles/globals.css";
// import { Auth0Provider } from "@auth0/auth0-react";

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
        {/* <Auth0Provider
          domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
          clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
          authorizationParams={{
            redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/app/dashboard`,
          }}
        > */}
        {children}
        {/* </Auth0Provider> */}
      </body>
    </html>
  );
}
