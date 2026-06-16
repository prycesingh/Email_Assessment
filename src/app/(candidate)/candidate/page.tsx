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
  const recentSessions = sessions.slice(0, 5);

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
          <StartAssessmentButton />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
          <CardDescription>Your latest assessment sessions and weighted score totals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assessment sessions yet.</p>
          ) : (
            recentSessions.map((session) => (
              <div
                key={session.sessionIdentifier}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{session.displayId}</p>
                  <p className="text-sm text-muted-foreground">
                    Started {session.startedAt.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.submittedScenarios}/{session.totalScenarios} scenarios submitted
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    {session.aiWeightedTotal != null
                      ? `${session.aiWeightedTotal.toFixed(2)} / 10 · ${session.aiGrade}`
                      : session.statusLabel}
                  </Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/candidate/results/${session.scenarios[session.scenarios.length - 1].assessmentId}`}>
                      View results
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
