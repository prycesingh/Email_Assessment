import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { promptVersions, rubrics } from "@/db/schema";
import { PromptEditor } from "@/components/prompt-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";

export default async function AdminPromptsPage() {
  await requireRole(["admin"]);

  const [activePrompt] = await db
    .select({ promptVersion: promptVersions, rubric: rubrics })
    .from(promptVersions)
    .innerJoin(rubrics, eq(promptVersions.rubricId, rubrics.id))
    .where(and(eq(promptVersions.active, true), eq(rubrics.active, true)))
    .orderBy(desc(promptVersions.createdAt))
    .limit(1);

  if (!activePrompt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No active prompt version</CardTitle>
          <CardDescription>
            Create or seed an active prompt version and rubric before managing evaluator settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Evaluation prompt</CardTitle>
          <CardDescription>Update the active OpenAI evaluation prompt and rubric weights.</CardDescription>
        </CardHeader>
        <CardContent>
          <PromptEditor promptVersion={activePrompt.promptVersion} rubric={activePrompt.rubric} />
        </CardContent>
      </Card>
    </div>
  );
}
