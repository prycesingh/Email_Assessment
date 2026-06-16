import Link from "next/link";

import { RegisterForm } from "@/features/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
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
          <CardHeader>
            <CardTitle>Registration disabled</CardTitle>
            <CardDescription>Jump directly to the candidate or admin flows.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Or return to the home page.
              <Link href="/" className="font-medium text-primary">
                Home
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
