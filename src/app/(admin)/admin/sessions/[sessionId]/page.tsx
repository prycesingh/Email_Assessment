import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";
import { getSessionSummaries } from "@/lib/session-results";

export default async function AdminSessionDetailPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  await requireRole(["admin", "assessor"]);
  const { sessionId } = await params;
  const [session] = await getSessionSummaries({ sessionIdentifier: sessionId });

  if (!session) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{session.displayId}</Badge>
                <Badge>{session.statusLabel}</Badge>
                <Badge>{session.totalScenarios} scenarios</Badge>
              </div>
              <CardTitle>Session review</CardTitle>
              <CardDescription>
                Candidate email: {session.candidateEmail}
              </CardDescription>
              <CardDescription>
                Session name: {session.displayName}
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="AI total"
            value={session.aiWeightedTotal != null ? `${session.aiWeightedTotal.toFixed(2)} / 10` : "Pending"}
            hint={session.aiGrade ? `Grade ${session.aiGrade}` : "Waiting for completed evaluation"}
          />
          <MetricCard
            label="Manual total"
            value={
              session.manualWeightedTotal != null
                ? `${session.manualWeightedTotal.toFixed(2)} / 10`
                : `${session.manualReviewedScenarios}/${session.totalScenarios} reviewed`
            }
            hint={session.manualGrade ? `Grade ${session.manualGrade}` : "Latest assessor entries"}
          />
          <MetricCard
            label="Started"
            value={session.startedAt.toLocaleString()}
            hint="Session launch time"
          />
          <MetricCard
            label="Submitted"
            value={session.lastSubmittedAt?.toLocaleString() ?? "Pending"}
            hint={`${session.submittedScenarios}/${session.totalScenarios} submitted`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scenario score table</CardTitle>
          <CardDescription>Each scenario keeps its rubric percentage and contributes weighted marks to the 10-point total.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Scenario</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">AI %</th>
                  <th className="px-4 py-3">AI weighted</th>
                  <th className="px-4 py-3">Manual %</th>
                  <th className="px-4 py-3">Manual weighted</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {session.scenarios.map((scenario) => (
                  <tr key={scenario.assessmentId} className="border-t align-top">
                    <td className="px-4 py-4">
                      <div className="font-medium">{scenario.scenarioTitle}</div>
                      <div className="text-muted-foreground">{scenario.scenarioCategory}</div>
                    </td>
                    <td className="px-4 py-4">{scenario.scenarioDifficulty}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {scenario.subject?.trim() ? scenario.subject : "No subject line submitted"}
                    </td>
                    <td className="px-4 py-4">
                      {scenario.evaluationOverallScore != null
                        ? `${scenario.evaluationOverallScore} / 100`
                        : "Pending"}
                    </td>
                    <td className="px-4 py-4">
                      {scenario.aiWeightedScore != null
                        ? `${scenario.aiWeightedScore.toFixed(2)} / ${scenario.scenarioMaxScore}`
                        : "Pending"}
                    </td>
                    <td className="px-4 py-4">
                      {scenario.manualOverallScore != null
                        ? `${scenario.manualOverallScore} / 100`
                        : "Pending"}
                    </td>
                    <td className="px-4 py-4">
                      {scenario.manualWeightedScore != null
                        ? `${scenario.manualWeightedScore.toFixed(2)} / ${scenario.scenarioMaxScore}`
                        : "Pending"}
                    </td>
                    <td className="px-4 py-4">
                      <Badge>{scenario.assessmentStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {session.scenarios.map((scenario) => (
          <Card key={scenario.assessmentId}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{scenario.scenarioDifficulty}</Badge>
                <Badge>{scenario.scenarioCategory}</Badge>
                <Badge>Max {scenario.scenarioMaxScore}</Badge>
              </div>
              <CardTitle>{scenario.scenarioTitle}</CardTitle>
              <CardDescription>{scenario.scenarioPrompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-sm font-medium text-muted-foreground">Subject line</p>
                <p className="mt-2 text-base font-medium">
                  {scenario.subject?.trim() ? scenario.subject : "No subject line submitted"}
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-sm font-medium text-muted-foreground">Candidate response</p>
                <p className="mt-2 whitespace-pre-wrap leading-7">
                  {scenario.content?.trim() ? scenario.content : "No response submitted."}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  label="AI percentage"
                  value={
                    scenario.evaluationOverallScore != null
                      ? `${scenario.evaluationOverallScore} / 100`
                      : "Pending"
                  }
                />
                <MetricCard
                  label="AI weighted"
                  value={
                    scenario.aiWeightedScore != null
                      ? `${scenario.aiWeightedScore.toFixed(2)} / ${scenario.scenarioMaxScore}`
                      : "Pending"
                  }
                  hint={scenario.evaluationGrade ? `Grade ${scenario.evaluationGrade}` : undefined}
                />
                <MetricCard
                  label="Manual weighted"
                  value={
                    scenario.manualWeightedScore != null
                      ? `${scenario.manualWeightedScore.toFixed(2)} / ${scenario.scenarioMaxScore}`
                      : "Pending"
                  }
                  hint={scenario.manualGrade ? `Grade ${scenario.manualGrade}` : undefined}
                />
              </div>
              {scenario.evaluationVerdict ? (
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <p className="text-sm font-medium text-muted-foreground">AI verdict</p>
                  <p className="mt-2 text-sm leading-6">{scenario.evaluationVerdict}</p>
                </div>
              ) : null}
              <div className="grid gap-4 md:grid-cols-3">
                <FeedbackCard title="Strengths" items={scenario.strengths} />
                <FeedbackCard title="Weaknesses" items={scenario.weaknesses} />
                <FeedbackCard title="Improvements" items={scenario.improvements} />
              </div>
              {scenario.manualSummary ? (
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Latest manual summary</p>
                  <p className="mt-2 text-sm leading-6">{scenario.manualSummary}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function FeedbackCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm leading-6">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No notes yet.</p>
      )}
    </div>
  );
}
