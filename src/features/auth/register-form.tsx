"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function RegisterForm() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Registration is disabled for this demo. Jump straight into the candidate or admin workflows.
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
