import { AdminSessionDashboard } from "@/components/admin-session-dashboard";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";
import { getSessionSummaries } from "@/lib/session-results";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);

  const sessions = await getSessionSummaries();
  const completedSessions = sessions.filter((session) => session.aiWeightedTotal != null);
  const pendingSessions = sessions.filter((session) => session.statusLabel !== "Completed");
  const averageSessionScore =
    completedSessions.length > 0
      ? (
          completedSessions.reduce((total, session) => total + (session.aiWeightedTotal ?? 0), 0) /
          completedSessions.length
        ).toFixed(2)
      : "0.00";
  const gradeDistribution = completedSessions.reduce<Record<string, number>>((totals, session) => {
    const key = session.aiGrade ?? "Pending";
    totals[key] = (totals[key] ?? 0) + 1;
    return totals;
  }, {});
  const scenarioPerformance = [...sessions
    .flatMap((session) => session.scenarios)
    .reduce((map, scenario) => {
      const existing = map.get(scenario.scenarioId) ?? {
        title: scenario.scenarioTitle,
        difficulty: scenario.scenarioDifficulty,
        attempts: 0,
        weightedTotal: 0
      };

      existing.attempts += 1;
      existing.weightedTotal += scenario.aiWeightedScore ?? 0;
      map.set(scenario.scenarioId, existing);
      return map;
    }, new Map<string, { title: string; difficulty: string; attempts: number; weightedTotal: number }>())
    .values()]
    .sort((left, right) => right.attempts - left.attempts)
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Session records" value={sessions.length} />
        <StatCard label="Completed sessions" value={completedSessions.length} />
        <StatCard label="Awaiting review" value={pendingSessions.length} />
        <StatCard label="Average session score" value={`${averageSessionScore} / 10`} />
      </section>

      <AdminSessionDashboard
        sessions={sessions.map((session) => ({
          sessionIdentifier: session.sessionIdentifier,
          displayId: session.displayId,
          displayName: session.displayName,
          candidateEmail: session.candidateEmail,
          statusLabel: session.statusLabel,
          startedAt: session.startedAt.toLocaleString(),
          lastSubmittedAt: session.lastSubmittedAt?.toLocaleString() ?? null,
          submittedScenarios: session.submittedScenarios,
          totalScenarios: session.totalScenarios,
          aiWeightedTotal: session.aiWeightedTotal,
          aiGrade: session.aiGrade,
          manualWeightedTotal: session.manualWeightedTotal,
          manualGrade: session.manualGrade
        }))}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grade distribution</CardTitle>
            <CardDescription>Weighted session grades across completed sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(gradeDistribution).length === 0 ? (
              <p className="text-sm text-muted-foreground">Completed session grades will appear here.</p>
            ) : (
              Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between rounded-xl border p-3">
                  <span>Grade {grade}</span>
                  <Badge>{count}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scenario performance</CardTitle>
            <CardDescription>Average weighted contribution by scenario.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenarioPerformance.length === 0 ? (
              <p className="text-sm text-muted-foreground">Scenario activity will appear here once candidates submit.</p>
            ) : (
              scenarioPerformance.map((item) => (
                <div key={item.title} className="rounded-xl border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.title}</p>
                    <Badge>{item.difficulty}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.attempts} attempts · avg {(item.weightedTotal / item.attempts).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
