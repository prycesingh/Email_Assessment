"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in production (replace with Sentry or similar)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="max-w-sm text-muted-foreground">
              An unexpected error occurred. Please try again. If the problem persists, contact
              support.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset}>
              Try again
            </Button>
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
