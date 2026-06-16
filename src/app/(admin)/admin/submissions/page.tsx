import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { evaluations, manualScores, scenarios, submissions, users } from "@/db/schema";
import { ManualScoreForm } from "@/components/manual-score-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";

export default async function AdminSubmissionsPage() {
  await requireRole(["admin", "assessor"]);

  const records = await db
    .select({
      submission: submissions,
      candidate: {
        name: users.name,
        email: users.email
      },
      scenario: {
        title: scenarios.title,
        difficulty: scenarios.difficulty,
        category: scenarios.category
      },
      evaluation: evaluations
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.candidateId, users.id))
    .innerJoin(scenarios, eq(submissions.scenarioId, scenarios.id))
    .leftJoin(evaluations, eq(evaluations.submissionId, submissions.id))
    .orderBy(desc(submissions.submittedAt));

  const scoreRecords = await db.select().from(manualScores);
  const scoreCountBySubmission = new Map<string, number>();
  scoreRecords.forEach((score) => {
    scoreCountBySubmission.set(score.submissionId, (scoreCountBySubmission.get(score.submissionId) ?? 0) + 1);
  });

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.submission.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{record.candidate.name}</CardTitle>
                <CardDescription>
                  {record.candidate.email} · {record.scenario.title}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge>{record.evaluation?.overallScore ?? "pending"} AI</Badge>
                <Badge>{scoreCountBySubmission.get(record.submission.id) ?? 0} manual</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="rounded-xl border bg-muted/30 p-4 text-sm leading-6">{record.submission.content}</p>
            <div className="flex justify-end">
              <Button asChild variant="outline" size="sm">
                <a href={`/api/admin/reports/export?submissionId=${record.submission.id}`}>Export PDF</a>
              </Button>
            </div>
            <ManualScoreForm submissionId={record.submission.id} />
          </CardContent>
        </Card>
      ))}
      {records.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No submissions yet</CardTitle>
            <CardDescription>Candidate submissions will appear here.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}
