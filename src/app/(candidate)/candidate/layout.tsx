"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide top header and use custom branding for assessment pages and the thank-you screen
  const isAssessmentRoute =
    pathname.startsWith("/candidate/assessment") ||
    pathname === "/candidate/thank-you";

  return (
    <AppShell
      title={isAssessmentRoute ? "Assessment Session" : "Candidate Dashboard"}
      subTitle={isAssessmentRoute ? "e-Mail  WRITING ASSESSMENT" : "Professional MSP communication assessment"}
      hideHeader={isAssessmentRoute}
      navItems={[
        { href: "/candidate", label: "Dashboard" },
        { href: "/candidate/assessment", label: "Assessment" }
      ]}
    >
      {children}
    </AppShell>
  );
}
