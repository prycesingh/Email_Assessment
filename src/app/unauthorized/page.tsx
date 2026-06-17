import Link from "next/link";
import { ShieldOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <ShieldOff className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="max-w-sm text-muted-foreground">
          You do not have permission to view this page. If you believe this is an error, please
          contact the system administrator.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild>
          <Link href="/candidate">Candidate dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
