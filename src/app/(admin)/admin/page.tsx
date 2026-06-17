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
          manualGrade: session.manualGrade,
          evaluatorScore: session.evaluatorScore
        }))}
      />
    </div>
  );
}
