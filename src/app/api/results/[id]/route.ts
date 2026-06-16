import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { assessments, evaluations, manualScores, scenarios, submissions } from "@/db/schema";
import { jsonError, requireApiUser } from "@/lib/api";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireApiUser(["candidate", "admin", "assessor"]);

  if (response) return response;

  const { id } = await params;
  const [record] = await db
    .select({
      assessment: assessments,
      submission: submissions,
      scenario: scenarios,
      evaluation: evaluations
    })
    .from(assessments)
    .innerJoin(submissions, eq(assessments.id, submissions.assessmentId))
    .innerJoin(scenarios, eq(assessments.scenarioId, scenarios.id))
    .leftJoin(evaluations, eq(submissions.id, evaluations.submissionId))
    .where(eq(assessments.id, id))
    .limit(1);

  if (!record) {
    return jsonError("Result not found.", 404);
  }

  if (user.role === "candidate" && record.assessment.candidateId !== user.id) {
    return jsonError("Result not found.", 404);
  }

  const manual = await db
    .select()
    .from(manualScores)
    .where(eq(manualScores.submissionId, record.submission.id));

  return NextResponse.json({ ...record, manualScores: manual });
}
