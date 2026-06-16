import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
};

export function AppShell({
  title,
  navItems,
  children
}: {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_32rem)]">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-bold tracking-tight">
              Email Assessment
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Button key={item.href} asChild variant="ghost" size="sm">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Professional MSP communication assessment</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
