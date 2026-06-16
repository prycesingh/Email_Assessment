import { AppShell } from "@/components/app-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      title="Admin Dashboard"
      navItems={[
        { href: "/admin", label: "Overview" },
        { href: "/admin/scenarios", label: "Scenarios" },
        { href: "/admin/prompts", label: "Prompts" },
        { href: "/admin/submissions", label: "Submissions" }
      ]}
    >
      {children}
    </AppShell>
  );
}
