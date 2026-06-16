import { AppShell } from "@/components/app-shell";

export default function AssessorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell title="Assessor Dashboard" navItems={[{ href: "/assessor", label: "Submissions" }]}>
      {children}
    </AppShell>
  );
}
