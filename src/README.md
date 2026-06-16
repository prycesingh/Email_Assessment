# AI-Powered Email Writing Assessment Platform

## Overview

The AI-Powered Email Writing Assessment Platform is a role-based assessment system designed to evaluate professional email writing skills for IT service professionals.

The platform simulates real-world MSP (Managed Service Provider) communication scenarios and automatically evaluates candidate responses using AI-driven scoring, rubric-based grading, and manual assessor reviews.

The system supports:

* Candidate assessment sessions
* AI-powered evaluation
* Manual assessor review
* Scenario management
* Prompt and rubric management
* Session analytics and reporting
* PDF export of assessment results

---

## Business Problem

Professional email communication is one of the most critical skills in IT support and managed services environments.

Organizations need a scalable method to:

* Assess communication skills objectively
* Standardize hiring evaluations
* Measure professionalism and customer communication
* Reduce manual review effort
* Provide actionable candidate feedback

This platform automates the entire assessment lifecycle while maintaining human review capabilities.

---

## Key Features

### Candidate Portal

* Start timed assessment sessions
* Complete multiple email-writing scenarios
* Navigate between scenarios within a session
* Auto-save responses
* View assessment results
* Review AI-generated feedback
* Track historical performance

### AI Evaluation Engine

Automatically evaluates:

* Professionalism
* Tone
* Grammar
* Structure
* Clarity
* Technical accuracy
* Scenario adherence

Generates:

* Overall score
* Weighted score
* Grade
* Strengths
* Weaknesses
* Improvement suggestions
* AI verdict

### Admin Portal

Administrators can:

* Create assessment scenarios
* Edit scenario prompts
* Manage evaluation prompts
* Configure scoring rubrics
* Review candidate sessions
* Analyze assessment statistics
* Export reports

### Assessor Portal

Human reviewers can:

* Review submissions
* Override scores
* Add manual evaluations
* Compare AI and manual scoring
* Provide detailed feedback

### Reporting & Analytics

* Session performance tracking
* Grade distribution
* Scenario performance metrics
* Candidate progress history
* PDF report generation

---

## Assessment Structure

Each assessment session consists of:

| Difficulty   | Count |
| ------------ | ----- |
| Beginner     | 2     |
| Intermediate | 2     |
| Advanced     | 1     |

Total Scenarios per Session: **5**

Assessment Duration: **30 Minutes**

---

## Scenario Categories

The platform contains a bank of MSP-focused communication scenarios.

### Beginner

* Planned Vacation Leave Request
* Follow-Up on Unresolved Ticket
* Ticket Resolved Client Notification
* New Client Onboarding Introduction
* End-of-Day Shift Handover

### Intermediate

* Partial Outage Client Notification
* Ticket Escalation to Tier 2
* Monthly IT Report
* Scheduled Maintenance Notification
* Client Complaint Response
* RMA Vendor Request
* Phishing Awareness Alert
* Employee Performance Feedback

### Advanced

* QBR Summary Email
* Project Delay Communication
* P1 Critical Outage Escalation
* Contract Renewal Proposal
* Business Impact Analysis
* Data Breach Notification
* Team Policy Change Communication

---

## Scoring Methodology

### AI Evaluation

Each submission is evaluated against a structured rubric.

Evaluation considers:

* Professional tone
* Clarity of communication
* Grammar and language quality
* Completeness of response
* Stakeholder awareness
* Business impact understanding
* Actionability
* MSP communication standards

### Score Generation

The evaluator produces:

```text
Overall Score: 0–100
Weighted Score: Scenario Contribution
Grade: A-F
```

### Feedback Generation

For every submission:

* Strengths
* Weaknesses
* Improvement Areas
* Final Verdict

are generated automatically.

---

## System Architecture

### Frontend

* Next.js App Router
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Server Actions
* RBAC Authorization Layer

### Database

* PostgreSQL
* Drizzle ORM
* Drizzle Migrations

### Authentication

* NextAuth
* Role-Based Access Control

Roles:

* Candidate
* Assessor
* Admin

### AI Evaluation Layer

Responsible for:

* Prompt orchestration
* Rubric application
* Score calculation
* Feedback generation

---

## Project Structure

```text
src/
├── app/
│   ├── (candidate)
│   ├── (admin)
│   ├── (assessor)
│   └── api/
│
├── components/
│   ├── ui/
│   └── shared components
│
├── db/
│   ├── schema.ts
│   ├── index.ts
│   └── seed data
│
├── services/
│   └── evaluation.ts
│
├── lib/
│   ├── scoring.ts
│   ├── rubric.ts
│   ├── rbac.ts
│   ├── session-results.ts
│   └── pdf.ts
│
└── features/
    └── auth/
```

---

## Core Modules

### Scenario Management

Allows administrators to:

* Create scenarios
* Edit prompts
* Manage difficulty levels
* Categorize assessments

### Assessment Engine

Responsible for:

* Session creation
* Timer management
* Submission handling
* Session progression

### Evaluation Service

Responsible for:

* AI scoring
* Rubric processing
* Grade calculation
* Feedback generation

### Reporting Module

Provides:

* Candidate scorecards
* Session summaries
* PDF exports
* Analytics dashboards

---

## Candidate Workflow

```text
Login
   ↓
Start Assessment
   ↓
Receive 5 Scenarios
   ↓
Write Email Responses
   ↓
Submit Responses
   ↓
AI Evaluation
   ↓
Score Generation
   ↓
Results Dashboard
```

---

## Admin Workflow

```text
Create Scenario
   ↓
Configure Rubric
   ↓
Publish Assessment
   ↓
Monitor Sessions
   ↓
Review Scores
   ↓
Export Reports
```

---

## Assessor Workflow

```text
View Submission
   ↓
Review AI Evaluation
   ↓
Add Manual Score
   ↓
Provide Feedback
   ↓
Finalize Review
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd email-assessment-platform
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create:

```env
.env
```

Example:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
OPENAI_API_KEY=
```

### Run Database Migrations

```bash
npx drizzle-kit push
```

### Start Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

## Testing

Run tests:

```bash
npm run test
```

Using:

* Vitest
* React Testing Utilities

---

## Future Enhancements

* Multi-language assessments
* Voice-based communication evaluation
* Real-time AI coaching
* Interview simulation mode
* Adaptive difficulty selection
* Candidate benchmarking
* Analytics dashboards powered by BI tools
* LLM comparison and evaluator versioning

---

## Expected Benefits

### For Recruiters

* Faster candidate screening
* Consistent evaluation standards
* Reduced manual effort

### For Candidates

* Real-world communication practice
* Detailed feedback
* Transparent scoring

### For Organizations

* Improved hiring quality
* Better communication standards
* Scalable assessment process

---

## Tech Stack

| Layer          | Technology          |
| -------------- | ------------------- |
| Frontend       | Next.js 15          |
| Language       | TypeScript          |
| Styling        | Tailwind CSS        |
| Database       | PostgreSQL          |
| ORM            | Drizzle ORM         |
| Authentication | NextAuth            |
| AI Evaluation  | OpenAI              |
| Testing        | Vitest              |
| Reporting      | PDF Export Services |

---

## License

Internal Project – IT By Design Assessment Platform

Confidential and proprietary. Intended for internal assessment, hiring, and training purposes.
