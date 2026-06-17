import { randomUUID } from "crypto";

import { StartAssessmentButton } from "@/components/start-assessment-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";

export default async function AssessmentLandingPage() {
  const user = await requireRole(["candidate", "admin"]);
  const preGeneratedSessionId = randomUUID();

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Timed Email Writing Assessment</CardTitle>
        <CardDescription>
          Verify your candidate details and read the instructions before starting the assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StartAssessmentButton
          candidateEmail={user.email}
          candidateId={user.id}
          preGeneratedSessionId={preGeneratedSessionId}
        />
      </CardContent>
    </Card>
  );
}
