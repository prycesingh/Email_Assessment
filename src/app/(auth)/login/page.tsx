import Link from "next/link";
import { Lock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_32rem)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold">
            Email Assessment
          </Link>
          <ThemeToggle />
        </div>
        <Card className="glass-panel">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Access to this platform is controlled by your organisation's identity provider.
              Please sign in through your portal to be granted access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              If you were sent a direct link, please use that link to access the assessment.
              Your session will be authenticated automatically by the platform.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Return to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
