# Graph Report - .  (2026-06-16)

## Corpus Check
- Corpus is ~16,747 words - fits in a single context window. You may not need a graph.

## Summary
- 303 nodes · 348 edges · 65 communities detected
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Pages & RBAC Data|Admin Pages & RBAC Data]]
- [[_COMMUNITY_Candidate Flow & API Routes|Candidate Flow & API Routes]]
- [[_COMMUNITY_API Route Handlers & Utilities|API Route Handlers & Utilities]]
- [[_COMMUNITY_Scoring & DB Aggregation|Scoring & DB Aggregation]]
- [[_COMMUNITY_Session Results & Scoring|Session Results & Scoring]]
- [[_COMMUNITY_AI Evaluation Service|AI Evaluation Service]]
- [[_COMMUNITY_UI Primitives & Dashboard|UI Primitives & Dashboard]]
- [[_COMMUNITY_Schema Enums|Schema Enums]]
- [[_COMMUNITY_Score Forms & Rubric Schema|Score Forms & Rubric Schema]]
- [[_COMMUNITY_AI Evaluation Pipeline|AI Evaluation Pipeline]]
- [[_COMMUNITY_Card UI Component|Card UI Component]]
- [[_COMMUNITY_Assessment Session Flow|Assessment Session Flow]]
- [[_COMMUNITY_RBAC Authorization Layer|RBAC Authorization Layer]]
- [[_COMMUNITY_Start Assessment Session State|Start Assessment Session State]]
- [[_COMMUNITY_Root Layout & Home|Root Layout & Home]]
- [[_COMMUNITY_Auth Pages (LoginRegister)|Auth Pages (Login/Register)]]
- [[_COMMUNITY_AppShell Dashboard Layouts|AppShell Dashboard Layouts]]
- [[_COMMUNITY_Retake Eligibility & Dates|Retake Eligibility & Dates]]
- [[_COMMUNITY_Class & URL Utilities|Class & URL Utilities]]
- [[_COMMUNITY_Theme Providers & Toggle|Theme Providers & Toggle]]
- [[_COMMUNITY_Scenario Edit Forms|Scenario Edit Forms]]
- [[_COMMUNITY_AppShell Component|AppShell Component]]
- [[_COMMUNITY_Assessment Editor Component|Assessment Editor Component]]
- [[_COMMUNITY_Manual Score Form Submit|Manual Score Form Submit]]
- [[_COMMUNITY_Prompt Editor Submit|Prompt Editor Submit]]
- [[_COMMUNITY_Providers Component|Providers Component]]
- [[_COMMUNITY_Scenario Edit Card|Scenario Edit Card]]
- [[_COMMUNITY_Scenario Form Component|Scenario Form Component]]
- [[_COMMUNITY_Score Radar Component|Score Radar Component]]
- [[_COMMUNITY_Stat Card Component|Stat Card Component]]
- [[_COMMUNITY_Theme Toggle Component|Theme Toggle Component]]
- [[_COMMUNITY_Badge UI Component|Badge UI Component]]
- [[_COMMUNITY_Login Form Feature|Login Form Feature]]
- [[_COMMUNITY_Register Form Feature|Register Form Feature]]
- [[_COMMUNITY_DB Config Loader|DB Config Loader]]
- [[_COMMUNITY_Auth API Routes|Auth API Routes]]
- [[_COMMUNITY_Auth Form Components|Auth Form Components]]
- [[_COMMUNITY_Session Structure Rationale|Session Structure Rationale]]
- [[_COMMUNITY_Next.js Env Types|Next.js Env Types]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Vitest Config|Vitest Config]]
- [[_COMMUNITY_Vitest Setup|Vitest Setup]]
- [[_COMMUNITY_Admin Dashboard Page|Admin Dashboard Page]]
- [[_COMMUNITY_Admin Scenarios Page|Admin Scenarios Page]]
- [[_COMMUNITY_Assessor Layout|Assessor Layout]]
- [[_COMMUNITY_Candidate Dashboard Page|Candidate Dashboard Page]]
- [[_COMMUNITY_Assessment Detail Page|Assessment Detail Page]]
- [[_COMMUNITY_Admin Session Dashboard File|Admin Session Dashboard File]]
- [[_COMMUNITY_Button UI File|Button UI File]]
- [[_COMMUNITY_Input UI File|Input UI File]]
- [[_COMMUNITY_Label UI File|Label UI File]]
- [[_COMMUNITY_Textarea UI File|Textarea UI File]]
- [[_COMMUNITY_DB Index File|DB Index File]]
- [[_COMMUNITY_Scenario Seed Data File|Scenario Seed Data File]]
- [[_COMMUNITY_NextAuth Types File|NextAuth Types File]]
- [[_COMMUNITY_Auth Handlers|Auth Handlers]]
- [[_COMMUNITY_Tailwind Config Object|Tailwind Config Object]]
- [[_COMMUNITY_Vitest Config Object|Vitest Config Object]]
- [[_COMMUNITY_Vitest Setup Object|Vitest Setup Object]]
- [[_COMMUNITY_Request IP Helper|Request IP Helper]]
- [[_COMMUNITY_JSON Error Helper|JSON Error Helper]]
- [[_COMMUNITY_Rate Limit Response|Rate Limit Response]]
- [[_COMMUNITY_Session Summary Type|Session Summary Type]]
- [[_COMMUNITY_Absolute URL Helper|Absolute URL Helper]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 19 edges
2. `GET()` - 14 edges
3. `requireApiUser` - 12 edges
4. `submissions table` - 11 edges
5. `evaluateSubmission` - 11 edges
6. `requireRole()` - 10 edges
7. `getSessionSummaries()` - 10 edges
8. `AdminSubmissionsPage()` - 9 edges
9. `auth()` - 8 edges
10. `evaluateSubmission()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `README states PostgreSQL database` --references--> `Drizzle DB Client`  [AMBIGUOUS]
  README.md → src/db/index.ts
- `getSessionSummaries` --implements--> `Human review retained alongside AI scoring`  [INFERRED]
  src/lib/session-results.ts → README.md
- `AI-Powered Email Writing Assessment Platform` --references--> `evaluateSubmission`  [INFERRED]
  README.md → src/services/evaluation.ts
- `LoginPage()` --semantically_similar_to--> `RegisterPage()`  [INFERRED] [semantically similar]
  src\app\(auth)\login\page.tsx → src\app\(auth)\register\page.tsx
- `Human review retained alongside AI scoring` --rationale_for--> `manual_scores table`  [INFERRED]
  README.md → src/db/schema.ts

## Hyperedges (group relationships)
- **RBAC-protected admin server pages** — page_admindashboardpage, page_adminpromptspage, page_adminscenariospage, page_adminsessiondetailpage, page_adminsubmissionspage, rbac_requirerole [EXTRACTED 0.90]
- **Submission scoring data flow** — schema_submissions, schema_evaluations, schema_manualscores, schema_scenarios, schema_users [EXTRACTED 0.85]
- **AppShell-based dashboard layouts** — layout_adminlayout, layout_assessorlayout, appshell_appshell [EXTRACTED 0.90]
- **Timed Session Creation Flow** — route_assessmentsstart, lib_scoring_distribution, lib_retakes_canretake, lib_ratelimit_enforceratelimit, db_schema_assessments, db_schema_scenarios [EXTRACTED 0.90]
- **Submission to Evaluation Pipeline** — route_submissions, service_evaluation_evaluatesubmission, db_schema_submissions, db_schema_assessments, db_schema_evaluations [EXTRACTED 0.85]
- **Candidate Session Results Rendering** — page_candidateresult, lib_sessionresults_getsessionsummaries, component_scoreradar, db_schema_evaluations, db_schema_manualscores [INFERRED 0.80]
- **shadcn/ui Primitives sharing cn utility** — badge_Badge, button_Button, card_Card, input_Input, label_Label, textarea_Textarea [INFERRED 0.85]
- **Admin CRUD forms (react-hook-form + zod + toast + router.refresh)** — manual_score_form_ManualScoreForm, prompt_editor_PromptEditor, scenario_form_ScenarioForm, scenario_edit_card_ScenarioEditCard [INFERRED 0.80]
- **Candidate assessment session flow** — start_assessment_button_StartAssessmentButton, assessment_editor_AssessmentEditor, api_assessments_start, api_submissions, api_assessments_end [INFERRED 0.80]
- **AI Evaluation Pipeline** — evaluation_evaluateSubmission, rubric_normalizeEvaluation, rubric_openAiEvaluationResponseSchema, schema_aiRequests, schema_aiResponses, schema_evaluations [EXTRACTED 0.90]
- **Session Scoring Aggregation** — sessionresults_getSessionSummaries, scoring_weightedScoreFromPercent, scoring_sessionGradeFromScore, scoring_scenarioMaxScore [EXTRACTED 0.85]
- **RBAC Authorization Layer** — rbac_UserRole, rbac_requireRole, api_requireApiUser, nextauthd_SessionAugmentation [INFERRED 0.80]

## Communities

### Community 0 - "Admin Pages & RBAC Data"
Cohesion: 0.07
Nodes (32): AdminSessionDashboard component, auth(), AuthSession type, AuthUserRole type, db (Drizzle client), getActivePrompt, ManualScoreForm component, AdminDashboardPage (+24 more)

### Community 1 - "Candidate Flow & API Routes"
Cohesion: 0.1
Nodes (37): AssessmentEditor, ScoreRadar, StartAssessmentButton, assessments table, auditLogs table, evaluations table, manualScores table, promptVersions table (+29 more)

### Community 2 - "API Route Handlers & Utilities"
Cohesion: 0.08
Nodes (16): jsonError(), requestIp(), requireApiUser(), addDays(), addMinutes(), isOnOrAfter(), createSimplePdf(), enforceRateLimit() (+8 more)

### Community 3 - "Scoring & DB Aggregation"
Cohesion: 0.15
Nodes (16): getDatabaseUrl, Drizzle DB Client, enforceRateLimit, Human review retained alongside AI scoring, README states PostgreSQL database, categoryTotal, gradeFromScore, normalizeEvaluation (+8 more)

### Community 4 - "Session Results & Scoring"
Cohesion: 0.22
Nodes (10): CandidateResultPage(), scenarioMaxScore(), sessionGradeFromScore(), sessionPercentFromScore(), weightedScoreFromPercent(), formatSessionDisplayId(), getLatestManualScores(), getSessionRows() (+2 more)

### Community 5 - "AI Evaluation Service"
Cohesion: 0.31
Nodes (9): estimateCostUsdCents(), evaluateSubmission(), getActivePrompt(), markEvaluationStatus(), parseModelJson(), safeErrorMessage(), categoryTotal(), gradeFromScore() (+1 more)

### Community 6 - "UI Primitives & Dashboard"
Cohesion: 0.2
Nodes (10): AdminSessionDashboard Component, AdminSessionRow Type, Badge UI Component, Button UI Component, Card UI Component, Input UI Component, Label UI Component, cn utility (lib/utils) (+2 more)

### Community 7 - "Schema Enums"
Cohesion: 0.22
Nodes (0): 

### Community 8 - "Score Forms & Rubric Schema"
Cohesion: 0.22
Nodes (9): POST /api/admin/manual-scores endpoint, PATCH /api/admin/prompts endpoint, CategoryScores Type (db/schema), categoryScoreSchema (lib/rubric), ManualScoreForm Component, manualScoreSchema (Zod), PromptEditor Component, promptEditorSchema (Zod) (+1 more)

### Community 9 - "AI Evaluation Pipeline"
Cohesion: 0.28
Nodes (9): evaluateSubmission, markEvaluationStatus, createSimplePdf, AI-Powered Email Writing Assessment Platform, evaluationJsonSchema (Zod), openAiEvaluationResponseSchema (JSON Schema), ai_requests table, ai_responses table (+1 more)

### Community 10 - "Card UI Component"
Cohesion: 0.33
Nodes (0): 

### Community 11 - "Assessment Session Flow"
Cohesion: 0.33
Nodes (6): POST /api/assessments/end endpoint, POST /api/assessments/start endpoint, POST /api/submissions endpoint, AssessmentEditor Component, differenceInSeconds (lib/date), StartAssessmentButton Component

### Community 12 - "RBAC Authorization Layer"
Cohesion: 0.47
Nodes (6): requireApiUser, NextAuth Session/JWT Augmentation, UserRole / roleNames, requireRole, requireUser, RBAC three-role design (Candidate/Assessor/Admin)

### Community 13 - "Start Assessment Session State"
Cohesion: 0.4
Nodes (0): 

### Community 14 - "Root Layout & Home"
Cohesion: 0.5
Nodes (2): RootLayout(), HomePage()

### Community 15 - "Auth Pages (Login/Register)"
Cohesion: 0.5
Nodes (2): LoginPage(), RegisterPage()

### Community 16 - "AppShell Dashboard Layouts"
Cohesion: 0.5
Nodes (3): AppShell layout component, AdminLayout(), AssessorLayout

### Community 17 - "Retake Eligibility & Dates"
Cohesion: 0.5
Nodes (4): addDays, isOnOrAfter, canRetake, nextRetakeAt

### Community 18 - "Class & URL Utilities"
Cohesion: 0.67
Nodes (0): 

### Community 19 - "Theme Providers & Toggle"
Cohesion: 0.67
Nodes (3): AppShell Component, Providers Component, ThemeToggle Component

### Community 20 - "Scenario Edit Forms"
Cohesion: 1.0
Nodes (3): /api/admin/scenarios endpoint, ScenarioEditCard Component, ScenarioForm Component

### Community 21 - "AppShell Component"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Assessment Editor Component"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Manual Score Form Submit"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Prompt Editor Submit"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Providers Component"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Scenario Edit Card"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Scenario Form Component"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Score Radar Component"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Stat Card Component"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Theme Toggle Component"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Badge UI Component"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Login Form Feature"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Register Form Feature"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "DB Config Loader"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Auth API Routes"
Cohesion: 1.0
Nodes (2): Auth Register Route, NextAuth Catch-All Route

### Community 36 - "Auth Form Components"
Cohesion: 1.0
Nodes (2): LoginForm (auth disabled demo), RegisterForm (auth disabled demo)

### Community 37 - "Session Structure Rationale"
Cohesion: 1.0
Nodes (2): 5-scenario / 30-minute session structure, Session Scenario Distribution

### Community 38 - "Next.js Env Types"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Tailwind Config"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Vitest Config"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Vitest Setup"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Admin Dashboard Page"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Admin Scenarios Page"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Assessor Layout"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Candidate Dashboard Page"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Assessment Detail Page"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Admin Session Dashboard File"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Button UI File"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Input UI File"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Label UI File"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Textarea UI File"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "DB Index File"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Scenario Seed Data File"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "NextAuth Types File"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Auth Handlers"
Cohesion: 1.0
Nodes (1): auth handlers (disabled)

### Community 57 - "Tailwind Config Object"
Cohesion: 1.0
Nodes (1): Tailwind config

### Community 58 - "Vitest Config Object"
Cohesion: 1.0
Nodes (1): Vitest config

### Community 59 - "Vitest Setup Object"
Cohesion: 1.0
Nodes (1): Vitest setup

### Community 60 - "Request IP Helper"
Cohesion: 1.0
Nodes (1): requestIp

### Community 61 - "JSON Error Helper"
Cohesion: 1.0
Nodes (1): jsonError

### Community 62 - "Rate Limit Response"
Cohesion: 1.0
Nodes (1): rateLimitResponse

### Community 63 - "Session Summary Type"
Cohesion: 1.0
Nodes (1): SessionSummary type

### Community 64 - "Absolute URL Helper"
Cohesion: 1.0
Nodes (1): absoluteUrl

## Ambiguous Edges - Review These
- `Drizzle DB Client` → `README states PostgreSQL database`  [AMBIGUOUS]
  README.md · relation: references

## Knowledge Gaps
- **53 isolated node(s):** `AuthUserRole type`, `auth handlers (disabled)`, `AssessorLayout`, `ScenarioForm component`, `Reports export API route` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `AppShell Component`** (2 nodes): `AppShell()`, `app-shell.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Assessment Editor Component`** (2 nodes): `AssessmentEditor()`, `assessment-editor.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Manual Score Form Submit`** (2 nodes): `onSubmit()`, `manual-score-form.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prompt Editor Submit`** (2 nodes): `onSubmit()`, `prompt-editor.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Providers Component`** (2 nodes): `Providers()`, `providers.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scenario Edit Card`** (2 nodes): `ScenarioEditCard()`, `scenario-edit-card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scenario Form Component`** (2 nodes): `ScenarioForm()`, `scenario-form.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Score Radar Component`** (2 nodes): `ScoreRadar()`, `score-radar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Stat Card Component`** (2 nodes): `stat-card.tsx`, `StatCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Toggle Component`** (2 nodes): `theme-toggle.tsx`, `ThemeToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Badge UI Component`** (2 nodes): `Badge()`, `badge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Form Feature`** (2 nodes): `LoginForm()`, `login-form.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Register Form Feature`** (2 nodes): `RegisterForm()`, `register-form.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DB Config Loader`** (2 nodes): `getDatabaseUrl()`, `db-config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth API Routes`** (2 nodes): `Auth Register Route`, `NextAuth Catch-All Route`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Form Components`** (2 nodes): `LoginForm (auth disabled demo)`, `RegisterForm (auth disabled demo)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Session Structure Rationale`** (2 nodes): `5-scenario / 30-minute session structure`, `Session Scenario Distribution`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Env Types`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vitest Config`** (1 nodes): `vitest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vitest Setup`** (1 nodes): `vitest.setup.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Dashboard Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Scenarios Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Assessor Layout`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Candidate Dashboard Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Assessment Detail Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Session Dashboard File`** (1 nodes): `admin-session-dashboard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Button UI File`** (1 nodes): `button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Input UI File`** (1 nodes): `input.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Label UI File`** (1 nodes): `label.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Textarea UI File`** (1 nodes): `textarea.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DB Index File`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scenario Seed Data File`** (1 nodes): `scenario-seed-data.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NextAuth Types File`** (1 nodes): `next-auth.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Handlers`** (1 nodes): `auth handlers (disabled)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config Object`** (1 nodes): `Tailwind config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vitest Config Object`** (1 nodes): `Vitest config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vitest Setup Object`** (1 nodes): `Vitest setup`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Request IP Helper`** (1 nodes): `requestIp`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `JSON Error Helper`** (1 nodes): `jsonError`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rate Limit Response`** (1 nodes): `rateLimitResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Session Summary Type`** (1 nodes): `SessionSummary type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Absolute URL Helper`** (1 nodes): `absoluteUrl`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Drizzle DB Client` and `README states PostgreSQL database`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `POST()` connect `API Route Handlers & Utilities` to `AI Evaluation Service`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `auth()` connect `Admin Pages & RBAC Data` to `API Route Handlers & Utilities`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `requireApiUser()` connect `API Route Handlers & Utilities` to `Admin Pages & RBAC Data`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `POST()` (e.g. with `requireApiUser()` and `jsonError()`) actually correct?**
  _`POST()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `GET()` (e.g. with `requireApiUser()` and `jsonError()`) actually correct?**
  _`GET()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `submissions table` (e.g. with `getSessionSummaries` and `wordCount`) actually correct?**
  _`submissions table` has 2 INFERRED edges - model-reasoned connections that need verification._