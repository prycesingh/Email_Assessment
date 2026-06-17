import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core";

// Enum definitions (MySQL ENUM type)
export const roleNameEnum = (name: string) => mysqlEnum(name, ["candidate", "admin", "assessor"]);
export const userStatusEnum = (name: string) => mysqlEnum(name, ["active", "suspended"]);
export const scenarioDifficultyEnum = (name: string) =>
  mysqlEnum(name, ["beginner", "intermediate", "advanced"]);
export const assessmentStatusEnum = (name: string) =>
  mysqlEnum(name, ["in_progress", "submitted", "evaluating", "completed", "expired", "failed"]);
export const evaluationStatusEnum = (name: string) =>
  mysqlEnum(name, ["pending", "completed", "failed_validation", "pending_retry", "failed"]);
export const aiRequestStatusEnum = (name: string) =>
  mysqlEnum(name, ["pending", "completed", "failed", "retrying"]);
export const gradeEnum = (name: string) => mysqlEnum(name, ["A", "B", "C", "D", "E"]);
export const auditActionEnum = (name: string) =>
  mysqlEnum(name, [
    "scenario_created",
    "scenario_updated",
    "scenario_archived",
    "assessment_started",
    "submission_created",
    "evaluation_completed",
    "manual_score_created",
    "report_exported"
  ]);

export type RubricWeights = {
  professionalTone: number;
  grammarLanguage: number;
  clarityEmpathyRespect: number;
  structure: number;
  completeness: number;
};

export type CategoryScores = RubricWeights;

export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: roleNameEnum("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(), // UUID stored as varchar(36)
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    emailVerified: timestamp("email_verified"),
    image: text("image"),
    passwordHash: text("password_hash"),
    roleId: int("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.roleId)
  })
);

export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state")
  },
  (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] })
  })
);

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull()
});

export const verificationTokens = mysqlTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] })
  })
);

export const rubrics = mysqlTable(
  "rubrics",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    version: varchar("version", { length: 64 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    weights: json("weights").$type<RubricWeights>().notNull(),
    active: boolean("active").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => ({
    versionIdx: uniqueIndex("rubrics_version_idx").on(table.version),
    activeIdx: index("rubrics_active_idx").on(table.active)
  })
);

export const promptVersions = mysqlTable(
  "prompt_versions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    version: varchar("version", { length: 64 }).notNull(),
    systemPrompt: text("system_prompt").notNull(),
    evaluationPrompt: text("evaluation_prompt").notNull(),
    rubricId: varchar("rubric_id", { length: 36 })
      .notNull()
      .references(() => rubrics.id, { onDelete: "restrict" }),
    model: varchar("model", { length: 120 }).notNull().default("gpt-4o-mini"),
    active: boolean("active").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => ({
    versionIdx: uniqueIndex("prompt_versions_version_idx").on(table.version),
    activeIdx: index("prompt_versions_active_idx").on(table.active)
  })
);

export const scenarios = mysqlTable(
  "scenarios",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    prompt: text("prompt").notNull(),
    difficulty: scenarioDifficultyEnum("difficulty").notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    active: boolean("active").notNull().default(true),
    modelAnswer: text("model_answer"),
    scoringNotes: text("scoring_notes"),
    source: varchar("source", { length: 160 }).notNull().default("ITBD scenario bank"),
    createdById: varchar("created_by_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null"
    }),
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
  },
  (table) => ({
    titleIdx: uniqueIndex("scenarios_title_idx").on(table.title),
    activeIdx: index("scenarios_active_idx").on(table.active),
    difficultyIdx: index("scenarios_difficulty_idx").on(table.difficulty),
    categoryIdx: index("scenarios_category_idx").on(table.category)
  })
);

export const assessments = mysqlTable(
  "assessments",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    candidateId: varchar("candidate_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scenarioId: varchar("scenario_id", { length: 36 })
      .notNull()
      .references(() => scenarios.id, { onDelete: "restrict" }),
    sessionId: varchar("session_id", { length: 36 }),
    sessionIndex: int("session_index"),
    status: assessmentStatusEnum("status").notNull().default("in_progress"),
    timeLimitMinutes: int("time_limit_minutes").notNull().default(30),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    dueAt: timestamp("due_at").notNull(),
    submittedAt: timestamp("submitted_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => ({
    candidateIdx: index("assessments_candidate_idx").on(table.candidateId),
    scenarioIdx: index("assessments_scenario_idx").on(table.scenarioId),
    statusIdx: index("assessments_status_idx").on(table.status),
    sessionIdx: index("assessments_session_idx").on(table.sessionId)
  })
);

export const submissions = mysqlTable(
  "submissions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    assessmentId: varchar("assessment_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => assessments.id, { onDelete: "cascade" }),
    candidateId: varchar("candidate_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    scenarioId: varchar("scenario_id", { length: 36 })
      .notNull()
      .references(() => scenarios.id, { onDelete: "restrict" }),
    subject: varchar("subject", { length: 998 }),
    content: text("content").notNull(),
    wordCount: int("word_count").notNull(),
    copyPenalty: int("copy_penalty").notNull().default(0),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    submittedAt: timestamp("submitted_at").notNull().defaultNow()
  },
  (table) => ({
    candidateIdx: index("submissions_candidate_idx").on(table.candidateId),
    scenarioIdx: index("submissions_scenario_idx").on(table.scenarioId)
  })
);

export const evaluations = mysqlTable(
  "evaluations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    submissionId: varchar("submission_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => submissions.id, { onDelete: "cascade" }),
    promptVersionId: varchar("prompt_version_id", { length: 36 }).references(() => promptVersions.id, {
      onDelete: "set null"
    }),
    rubricId: varchar("rubric_id", { length: 36 }).references(() => rubrics.id, {
      onDelete: "set null"
    }),
    status: evaluationStatusEnum("status").notNull().default("pending"),
    overallScore: int("overall_score"),
    grade: gradeEnum("grade"),
    categoryScores: json("category_scores").$type<CategoryScores>(),
    strengths: json("strengths").$type<string[]>(),
    weaknesses: json("weaknesses").$type<string[]>(),
    improvements: json("improvements").$type<string[]>(),
    detailedFeedback: text("detailed_feedback"),
    verdict: text("verdict"),
    aiDetected: boolean("ai_detected").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
  },
  (table) => ({
    statusIdx: index("evaluations_status_idx").on(table.status),
    gradeIdx: index("evaluations_grade_idx").on(table.grade)
  })
);

export const sessionManualScores = mysqlTable(
  "session_manual_scores",
  {
    sessionId: varchar("session_id", { length: 36 }).primaryKey(),
    score: int("score").notNull(),
    notes: text("notes"),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
  }
);

export const manualScores = mysqlTable(
  "manual_scores",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    submissionId: varchar("submission_id", { length: 36 })
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    assessorId: varchar("assessor_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    overallScore: int("overall_score").notNull(),
    grade: gradeEnum("grade").notNull(),
    categoryScores: json("category_scores").$type<CategoryScores>().notNull(),
    summary: text("summary").notNull(),
    improvementAreas: json("improvement_areas").$type<string[]>().notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
  },
  (table) => ({
    submissionIdx: index("manual_scores_submission_idx").on(table.submissionId),
    assessorIdx: index("manual_scores_assessor_idx").on(table.assessorId)
  })
);

export const aiRequests = mysqlTable(
  "ai_requests",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    submissionId: varchar("submission_id", { length: 36 })
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    promptVersionId: varchar("prompt_version_id", { length: 36 }).references(() => promptVersions.id, {
      onDelete: "set null"
    }),
    model: varchar("model", { length: 120 }).notNull(),
    status: aiRequestStatusEnum("status").notNull().default("pending"),
    requestPayload: json("request_payload").notNull(),
    inputTokens: int("input_tokens"),
    outputTokens: int("output_tokens"),
    costUsdCents: int("cost_usd_cents"),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at")
  },
  (table) => ({
    submissionIdx: index("ai_requests_submission_idx").on(table.submissionId),
    statusIdx: index("ai_requests_status_idx").on(table.status)
  })
);

export const aiResponses = mysqlTable("ai_responses", {
  id: varchar("id", { length: 36 }).primaryKey(),
  aiRequestId: varchar("ai_request_id", { length: 36 })
    .notNull()
    .references(() => aiRequests.id, { onDelete: "cascade" }),
  rawResponse: json("raw_response").notNull(),
  validationErrors: json("validation_errors").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    actorId: varchar("actor_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }),
    action: auditActionEnum("action").notNull(),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: varchar("entity_id", { length: 36 }),
    metadata: json("metadata").notNull(),
    ipAddress: varchar("ip_address", { length: 64 }),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => ({
    actorIdx: index("audit_logs_actor_idx").on(table.actorId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    entityIdx: index("audit_logs_entity_idx").on(table.entityType, table.entityId)
  })
);

export const rateLimits = mysqlTable("rate_limits", {
  key: varchar("key", { length: 240 }).primaryKey(),
  windowStart: timestamp("window_start").notNull(),
  count: int("count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users)
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id]
  }),
  assessments: many(assessments),
  manualScores: many(manualScores)
}));

export const scenariosRelations = relations(scenarios, ({ many }) => ({
  assessments: many(assessments),
  submissions: many(submissions)
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  candidate: one(users, {
    fields: [assessments.candidateId],
    references: [users.id]
  }),
  scenario: one(scenarios, {
    fields: [assessments.scenarioId],
    references: [scenarios.id]
  }),
  submission: one(submissions)
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [submissions.assessmentId],
    references: [assessments.id]
  }),
  candidate: one(users, {
    fields: [submissions.candidateId],
    references: [users.id]
  }),
  scenario: one(scenarios, {
    fields: [submissions.scenarioId],
    references: [scenarios.id]
  }),
  evaluation: one(evaluations),
  manualScores: many(manualScores),
  aiRequests: many(aiRequests)
}));

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  submission: one(submissions, {
    fields: [evaluations.submissionId],
    references: [submissions.id]
  }),
  promptVersion: one(promptVersions, {
    fields: [evaluations.promptVersionId],
    references: [promptVersions.id]
  }),
  rubric: one(rubrics, {
    fields: [evaluations.rubricId],
    references: [rubrics.id]
  })
}));

export const manualScoresRelations = relations(manualScores, ({ one }) => ({
  submission: one(submissions, {
    fields: [manualScores.submissionId],
    references: [submissions.id]
  }),
  assessor: one(users, {
    fields: [manualScores.assessorId],
    references: [users.id]
  })
}));
