import OpenAI from "openai";
import { randomUUID } from "crypto";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  aiRequests,
  aiResponses,
  assessments,
  auditLogs,
  evaluations,
  promptVersions,
  rubrics,
  scenarios,
  submissions
} from "@/db/schema";
import {
  calculateCopyPenalty,
  evaluationJsonSchema,
  normalizeEvaluation,
  openAiEvaluationResponseSchema
} from "@/lib/rubric";

const MAX_EVALUATION_ATTEMPTS = 2;

function safeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown evaluation error";
}

function parseModelJson(content: string | null | undefined) {
  if (!content) {
    throw new Error("OpenAI returned an empty evaluation response.");
  }

  return JSON.parse(content);
}

function estimateCostUsdCents(inputTokens?: number | null, outputTokens?: number | null) {
  const inputRate = Number(process.env.OPENAI_INPUT_COST_PER_1M_TOKENS_CENTS);
  const outputRate = Number(process.env.OPENAI_OUTPUT_COST_PER_1M_TOKENS_CENTS);

  if (!inputTokens || !outputTokens || !inputRate || !outputRate) {
    return null;
  }

  return Math.round((inputTokens / 1_000_000) * inputRate + (outputTokens / 1_000_000) * outputRate);
}

async function getActivePrompt() {
  const [record] = await db
    .select({
      promptVersion: promptVersions,
      rubric: rubrics
    })
    .from(promptVersions)
    .innerJoin(rubrics, eq(promptVersions.rubricId, rubrics.id))
    .where(and(eq(promptVersions.active, true), eq(rubrics.active, true)))
    .orderBy(desc(promptVersions.createdAt))
    .limit(1);

  if (!record) {
    throw new Error("No active prompt version and rubric found.");
  }

  return record;
}

async function markEvaluationStatus(
  submissionId: string,
  status: "pending_retry" | "failed_validation" | "failed"
) {
  await db
    .insert(evaluations)
    .values({ id: randomUUID(), submissionId, status })
    .onDuplicateKeyUpdate({
      set: {
        status,
        updatedAt: new Date()
      }
    });
}

export async function evaluateSubmission(submissionId: string) {
  const [submissionContext] = await db
    .select({
      submissionId: submissions.id,
      assessmentId: submissions.assessmentId,
      candidateId: submissions.candidateId,
      subject: submissions.subject,
      content: submissions.content,
      difficulty: scenarios.difficulty,
      scenarioTitle: scenarios.title,
      scenarioPrompt: scenarios.prompt,
      scoringNotes: scenarios.scoringNotes,
      modelAnswer: scenarios.modelAnswer
    })
    .from(submissions)
    .innerJoin(scenarios, eq(submissions.scenarioId, scenarios.id))
    .where(eq(submissions.id, submissionId))
    .limit(1);

  if (!submissionContext) {
    throw new Error("Submission not found.");
  }

  const { promptVersion, rubric } = await getActivePrompt();
  const model = process.env.OPENAI_EVALUATION_MODEL ?? promptVersion.model;
  const requestPayload = {
    model,
    scenario: {
      title: submissionContext.scenarioTitle,
      prompt: submissionContext.scenarioPrompt,
      scoringNotes: submissionContext.scoringNotes
    },
    rubric: rubric.weights,
    candidateResponse: submissionContext.content
  };

  if (!process.env.OPENAI_API_KEY) {
    await markEvaluationStatus(submissionId, "pending_retry");
    await db.insert(aiRequests).values({
      id: randomUUID(),
      submissionId,
      promptVersionId: promptVersion.id,
      model,
      status: "failed",
      requestPayload,
      errorMessage: "OPENAI_API_KEY is not configured."
    });

    return { status: "pending_retry" as const };
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30_000,
    maxRetries: 1
  });

  for (let attempt = 1; attempt <= MAX_EVALUATION_ATTEMPTS; attempt += 1) {
    const aiRequestId = randomUUID();

    await db.insert(aiRequests).values({
      id: aiRequestId,
      submissionId,
      promptVersionId: promptVersion.id,
      model,
      status: "pending",
      requestPayload: {
        ...requestPayload,
        attempt
      }
    });

    try {
      const candidateSubject =
        submissionContext.subject ?? "(no subject line provided)";

      const completion = await client.chat.completions.create({
        model,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `${promptVersion.systemPrompt}

AI DETECTION INSTRUCTIONS:
You MUST set "aiDetected" to true if the candidate's response exhibits any of the following characteristics of AI-generated text:
- Overly formal, generic, or templated language with no natural variation
- Suspiciously perfect grammar and sentence structure throughout
- Repeated use of filler phrases like "I hope this email finds you well", "Please do not hesitate", "I trust this message", "looking forward to hearing from you" in formulaic combinations
- Lack of specific, concrete details that a human with genuine understanding would typically include
- Unnaturally balanced paragraph lengths and a textbook-style structure that feels robotic
- Absence of any personal voice, imperfections, or minor stylistic quirks typical of human writing
Set "aiDetected" to false if the response reads naturally and shows genuine human understanding of the scenario.`
          },
          {
            role: "user",
            content: `${promptVersion.evaluationPrompt}

Scenario Title:
${submissionContext.scenarioTitle}

Scenario Prompt:
${submissionContext.scenarioPrompt}

Scenario Difficulty: ${submissionContext.difficulty}
Scenario Scoring Notes:
${submissionContext.scoringNotes ?? "None provided."}

Candidate Email Subject:
${candidateSubject}

Candidate Email Body:
${submissionContext.content}`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "email_assessment_evaluation",
            strict: true,
            schema: openAiEvaluationResponseSchema
          }
        }
      });

      const rawResponse = JSON.parse(JSON.stringify(completion));
      const content = completion.choices[0]?.message?.content;
      const parsedJson = parseModelJson(content);
      const parsed = evaluationJsonSchema.safeParse(parsedJson);

      await db.insert(aiResponses).values({
        id: randomUUID(),
        aiRequestId,
        rawResponse,
        validationErrors: parsed.success
          ? null
          : parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      });

      if (!parsed.success) {
        await db
          .update(aiRequests)
          .set({
            status: attempt === MAX_EVALUATION_ATTEMPTS ? "failed" : "retrying",
            errorMessage: "OpenAI response failed schema validation.",
            completedAt: new Date()
          })
          .where(eq(aiRequests.id, aiRequestId));

        if (attempt === MAX_EVALUATION_ATTEMPTS) {
          await markEvaluationStatus(submissionId, "failed_validation");
          await db
            .update(assessments)
            .set({ status: "failed" })
            .where(eq(assessments.id, submissionContext.assessmentId));

          return { status: "failed_validation" as const };
        }

        continue;
      }

      const normalized = normalizeEvaluation(parsed.data);
      const inputTokens = completion.usage?.prompt_tokens ?? null;
      const outputTokens = completion.usage?.completion_tokens ?? null;
      const evaluationId = randomUUID();

      // Calculate plagiarism/copy penalty against model answer
      const copyPenaltyAmount = calculateCopyPenalty(
        submissionContext.content,
        submissionContext.modelAnswer
      );

      // Save copy penalty to the submission record
      if (copyPenaltyAmount > 0) {
        await db
          .update(submissions)
          .set({ copyPenalty: Math.round(copyPenaltyAmount * 100) }) // stored as integer cents (x100)
          .where(eq(submissions.id, submissionId));
      }

      await db
        .insert(evaluations)
        .values({
          id: evaluationId,
          submissionId,
          promptVersionId: promptVersion.id,
          rubricId: rubric.id,
          status: "completed",
          overallScore: normalized.overallScore,
          grade: normalized.grade,
          categoryScores: normalized.categoryScores,
          strengths: normalized.strengths,
          weaknesses: normalized.weaknesses,
          improvements: normalized.improvements,
          detailedFeedback: normalized.detailedFeedback,
          verdict: normalized.verdict,
          aiDetected: normalized.aiDetected
        })
        .onDuplicateKeyUpdate({
          set: {
            promptVersionId: promptVersion.id,
            rubricId: rubric.id,
            status: "completed",
            overallScore: normalized.overallScore,
            grade: normalized.grade,
            categoryScores: normalized.categoryScores,
            strengths: normalized.strengths,
            weaknesses: normalized.weaknesses,
            improvements: normalized.improvements,
            detailedFeedback: normalized.detailedFeedback,
            verdict: normalized.verdict,
            aiDetected: normalized.aiDetected,
            updatedAt: new Date()
          }
        });

      await db
        .update(aiRequests)
        .set({
          status: "completed",
          inputTokens,
          outputTokens,
          costUsdCents: estimateCostUsdCents(inputTokens, outputTokens),
          completedAt: new Date()
        })
        .where(eq(aiRequests.id, aiRequestId));

      await db
        .update(assessments)
        .set({
          status: "completed",
          completedAt: new Date()
        })
        .where(eq(assessments.id, submissionContext.assessmentId));

      await db.insert(auditLogs).values({
        id: randomUUID(),
        actorId: submissionContext.candidateId,
        action: "evaluation_completed",
        entityType: "submission",
        entityId: submissionId,
        metadata: {
          evaluationId,
          promptVersionId: promptVersion.id,
          model,
          aiDetected: normalized.aiDetected,
          copyPenalty: copyPenaltyAmount
        },
        ipAddress: null
      });

      return { status: "completed" as const, evaluation: normalized };
    } catch (error) {
      await db
        .update(aiRequests)
        .set({
          status: attempt === MAX_EVALUATION_ATTEMPTS ? "failed" : "retrying",
          errorMessage: safeErrorMessage(error),
          completedAt: new Date()
        })
        .where(eq(aiRequests.id, aiRequestId));

      if (attempt === MAX_EVALUATION_ATTEMPTS) {
        await markEvaluationStatus(submissionId, "pending_retry");
        return { status: "pending_retry" as const };
      }
    }
  }

  await markEvaluationStatus(submissionId, "failed");
  return { status: "failed" as const };
}
