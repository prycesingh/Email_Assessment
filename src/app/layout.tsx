import type { Metadata } from "next";

import "@/app/globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Email Assessment Platform",
  description: "Professional email writing assessment platform for MSP communication."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
