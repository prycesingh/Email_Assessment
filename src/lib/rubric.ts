import { z } from "zod";

import type { CategoryScores } from "@/db/schema";

export const categoryScoreSchema = z.object({
  professionalTone: z.number().int().min(0).max(20),
  grammarLanguage: z.number().int().min(0).max(20),
  clarityEmpathyRespect: z.number().int().min(0).max(30),
  structure: z.number().int().min(0).max(15),
  completeness: z.number().int().min(0).max(15)
});

export const evaluationJsonSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  grade: z.enum(["A", "B", "C", "D", "E"]),
  categoryScores: categoryScoreSchema,
  strengths: z.array(z.string().min(1)).max(8),
  weaknesses: z.array(z.string().min(1)).max(8),
  improvements: z.array(z.string().min(1)).max(8),
  detailedFeedback: z.string().min(1),
  verdict: z.string().min(1)
});

export type EvaluationJson = z.infer<typeof evaluationJsonSchema>;

export function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "E" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 35) return "D";
  return "E";
}

export function categoryTotal(categoryScores: CategoryScores) {
  return Object.values(categoryScores).reduce((sum, value) => sum + value, 0);
}

export function normalizeEvaluation(evaluation: EvaluationJson): EvaluationJson {
  const computedScore = Math.max(0, Math.min(100, Math.round(categoryTotal(evaluation.categoryScores))));

  return {
    ...evaluation,
    overallScore: computedScore,
    grade: gradeFromScore(computedScore)
  };
}

export const openAiEvaluationResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "grade",
    "categoryScores",
    "strengths",
    "weaknesses",
    "improvements",
    "detailedFeedback",
    "verdict"
  ],
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    grade: { type: "string", enum: ["A", "B", "C", "D", "E"] },
    categoryScores: {
      type: "object",
      additionalProperties: false,
      required: [
        "professionalTone",
        "grammarLanguage",
        "clarityEmpathyRespect",
        "structure",
        "completeness"
      ],
      properties: {
        professionalTone: { type: "integer", minimum: 0, maximum: 20 },
        grammarLanguage: { type: "integer", minimum: 0, maximum: 20 },
        clarityEmpathyRespect: { type: "integer", minimum: 0, maximum: 30 },
        structure: { type: "integer", minimum: 0, maximum: 15 },
        completeness: { type: "integer", minimum: 0, maximum: 15 }
      }
    },
    strengths: {
      type: "array",
      maxItems: 8,
      items: { type: "string" }
    },
    weaknesses: {
      type: "array",
      maxItems: 8,
      items: { type: "string" }
    },
    improvements: {
      type: "array",
      maxItems: 8,
      items: { type: "string" }
    },
    detailedFeedback: { type: "string" },
    verdict: { type: "string" }
  }
} as const;
