import { randomUUID } from "crypto";
import Link from "next/link";

import { StartAssessmentButton } from "@/components/start-assessment-button";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";
import { getSessionSummaries } from "@/lib/session-results";

export default async function CandidateDashboardPage() {
  const user = await requireRole(["candidate", "admin"]);
  const sessions = await getSessionSummaries({ candidateId: user.id });
  const completedSessions = sessions.filter((session) => session.aiWeightedTotal != null);
  const averageScore =
    completedSessions.length > 0
      ? (
          completedSessions.reduce((total, session) => total + (session.aiWeightedTotal ?? 0), 0) /
          completedSessions.length
        ).toFixed(2)
      : "0.00";
  const bestScore = completedSessions.length > 0
    ? Math.max(...completedSessions.map((session) => session.aiWeightedTotal ?? 0)).toFixed(2)
    : "0.00";

  const preGeneratedSessionId = randomUUID();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Sessions" value={sessions.length} />
        <StatCard label="Average session score" value={`${averageScore} / 10`} />
        <StatCard label="Best session score" value={`${bestScore} / 10`} />
      </section>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Ready for your next assessment?</CardTitle>
          <CardDescription>
            Each assessment session includes 5 scenarios and lasts 30 minutes total. Retakes unlock after a 3-day cooldown.
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
    </div>
  );
}
