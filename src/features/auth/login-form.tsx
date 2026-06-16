"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoginForm() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Authentication is disabled for this demo. Use the direct app links below.
      </p>
      <div className="grid gap-3">
        <Link href="/candidate">
          <Button className="w-full">Go to candidate dashboard</Button>
        </Link>
        <Link href="/admin">
          <Button variant="outline" className="w-full">
            Go to admin dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
