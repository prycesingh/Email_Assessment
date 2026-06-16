import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { evaluations, scenarios, submissions, users } from "@/db/schema";
import { requireApiUser } from "@/lib/api";

export async function GET() {
  const { response } = await requireApiUser(["admin", "assessor"]);

  if (response) return response;

  const records = await db
    .select({
      submission: submissions,
      candidate: {
        id: users.id,
        name: users.name,
        email: users.email
      },
      scenario: {
        id: scenarios.id,
        title: scenarios.title,
        difficulty: scenarios.difficulty,
        category: scenarios.category
      },
      evaluation: evaluations
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.candidateId, users.id))
    .innerJoin(scenarios, eq(submissions.scenarioId, scenarios.id))
    .leftJoin(evaluations, eq(submissions.id, evaluations.submissionId))
    .orderBy(desc(submissions.submittedAt));

  return NextResponse.json({ submissions: records });
}
