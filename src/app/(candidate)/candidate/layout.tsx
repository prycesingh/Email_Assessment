import { AppShell } from "@/components/app-shell";

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      title="Candidate Dashboard"
      navItems={[
        { href: "/candidate", label: "Dashboard" },
        { href: "/candidate/assessment", label: "Assessment" }
      ]}
    >
      {children}
    </AppShell>
  );
}
