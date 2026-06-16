import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_36rem)]">
      <div className="container flex min-h-screen flex-col">
        <header className="flex h-20 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Email Assessment
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link href="/candidate">Candidate</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </div>
        </header>
        <section className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 inline-flex rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            MSP communication assessment platform
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
            Measure email judgment, not just grammar.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A production-ready assessment workflow for candidate email writing, AI feedback, and
            admin review.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/candidate">
                Start assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/admin">Admin dashboard</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
