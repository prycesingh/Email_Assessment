import { redirect } from "next/navigation";

import { StartAssessmentButton } from "@/components/start-assessment-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";

export default async function AssessmentLandingPage() {
  await requireRole(["candidate", "admin"]);

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Start a timed assessment</CardTitle>
        <CardDescription>
          The system will assign 5 active scenarios: 2 beginner, 2 intermediate, and 1 advanced, with a shared 30-minute session timer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StartAssessmentButton />
        <form
          action={async () => {
            "use server";
            redirect("/candidate");
          }}
        />
      </CardContent>
    </Card>
  );
}
