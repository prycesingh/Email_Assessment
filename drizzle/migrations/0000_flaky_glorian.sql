CREATE TABLE `accounts` (
	`user_id` varchar(36) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` text,
	`id_token` text,
	`session_state` text,
	CONSTRAINT `accounts_provider_provider_account_id_pk` PRIMARY KEY(`provider`,`provider_account_id`)
);
--> statement-breakpoint
CREATE TABLE `ai_requests` (
	`id` varchar(36) NOT NULL,
	`submission_id` varchar(36) NOT NULL,
	`prompt_version_id` varchar(36),
	`model` varchar(120) NOT NULL,
	`status` enum('pending','completed','failed','retrying') NOT NULL DEFAULT 'pending',
	`request_payload` json NOT NULL,
	`input_tokens` int,
	`output_tokens` int,
	`cost_usd_cents` int,
	`error_message` text,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `ai_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_responses` (
	`id` varchar(36) NOT NULL,
	`ai_request_id` varchar(36) NOT NULL,
	`raw_response` json NOT NULL,
	`validation_errors` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` varchar(36) NOT NULL,
	`candidate_id` varchar(36) NOT NULL,
	`scenario_id` varchar(36) NOT NULL,
	`session_id` varchar(36),
	`session_index` int,
	`status` enum('in_progress','submitted','evaluating','completed','expired','failed') NOT NULL DEFAULT 'in_progress',
	`time_limit_minutes` int NOT NULL DEFAULT 30,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`due_at` timestamp NOT NULL,
	`submitted_at` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`actor_id` varchar(36),
	`action` enum('scenario_created','scenario_updated','scenario_archived','assessment_started','submission_created','evaluation_completed','manual_score_created','report_exported') NOT NULL,
	`entity_type` varchar(80) NOT NULL,
	`entity_id` varchar(36),
	`metadata` json NOT NULL,
	`ip_address` varchar(64),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` varchar(36) NOT NULL,
	`submission_id` varchar(36) NOT NULL,
	`prompt_version_id` varchar(36),
	`rubric_id` varchar(36),
	`status` enum('pending','completed','failed_validation','pending_retry','failed') NOT NULL DEFAULT 'pending',
	`overall_score` int,
	`grade` enum('A','B','C','D','E'),
	`category_scores` json,
	`strengths` json,
	`weaknesses` json,
	`improvements` json,
	`detailed_feedback` text,
	`verdict` text,
	`ai_detected` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`),
	CONSTRAINT `evaluations_submission_id_unique` UNIQUE(`submission_id`)
);
--> statement-breakpoint
CREATE TABLE `manual_scores` (
	`id` varchar(36) NOT NULL,
	`submission_id` varchar(36) NOT NULL,
	`assessor_id` varchar(36) NOT NULL,
	`overall_score` int NOT NULL,
	`grade` enum('A','B','C','D','E') NOT NULL,
	`category_scores` json NOT NULL,
	`summary` text NOT NULL,
	`improvement_areas` json NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `manual_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prompt_versions` (
	`id` varchar(36) NOT NULL,
	`version` varchar(64) NOT NULL,
	`system_prompt` text NOT NULL,
	`evaluation_prompt` text NOT NULL,
	`rubric_id` varchar(36) NOT NULL,
	`model` varchar(120) NOT NULL DEFAULT 'gpt-4o-mini',
	`active` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prompt_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompt_versions_version_idx` UNIQUE(`version`)
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` varchar(240) NOT NULL,
	`window_start` timestamp NOT NULL,
	`count` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rate_limits_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` enum('candidate','admin','assessor') NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `rubrics` (
	`id` varchar(36) NOT NULL,
	`version` varchar(64) NOT NULL,
	`name` varchar(180) NOT NULL,
	`weights` json NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rubrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `rubrics_version_idx` UNIQUE(`version`)
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` varchar(36) NOT NULL,
	`title` varchar(220) NOT NULL,
	`prompt` text NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL,
	`category` varchar(120) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`model_answer` text,
	`scoring_notes` text,
	`source` varchar(160) NOT NULL DEFAULT 'ITBD scenario bank',
	`created_by_id` varchar(36),
	`archived_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `scenarios_title_idx` UNIQUE(`title`)
);
--> statement-breakpoint
CREATE TABLE `session_manual_scores` (
	`session_id` varchar(36) NOT NULL,
	`score` int NOT NULL,
	`notes` text,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `session_manual_scores_session_id` PRIMARY KEY(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_token` varchar(255) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_session_token` PRIMARY KEY(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` varchar(36) NOT NULL,
	`assessment_id` varchar(36) NOT NULL,
	`candidate_id` varchar(36) NOT NULL,
	`scenario_id` varchar(36) NOT NULL,
	`subject` varchar(998),
	`content` text NOT NULL,
	`word_count` int NOT NULL,
	`copy_penalty` int NOT NULL DEFAULT 0,
	`ip_address` varchar(64),
	`user_agent` text,
	`submitted_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `submissions_assessment_id_unique` UNIQUE(`assessment_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`email_verified` timestamp,
	`image` text,
	`password_hash` text,
	`role_id` int NOT NULL,
	`status` enum('active','suspended') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verification_tokens_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_requests` ADD CONSTRAINT `ai_requests_submission_id_submissions_id_fk` FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_requests` ADD CONSTRAINT `ai_requests_prompt_version_id_prompt_versions_id_fk` FOREIGN KEY (`prompt_version_id`) REFERENCES `prompt_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_responses` ADD CONSTRAINT `ai_responses_ai_request_id_ai_requests_id_fk` FOREIGN KEY (`ai_request_id`) REFERENCES `ai_requests`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_candidate_id_users_id_fk` FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_scenario_id_scenarios_id_fk` FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actor_id_users_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_submission_id_submissions_id_fk` FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_prompt_version_id_prompt_versions_id_fk` FOREIGN KEY (`prompt_version_id`) REFERENCES `prompt_versions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_rubric_id_rubrics_id_fk` FOREIGN KEY (`rubric_id`) REFERENCES `rubrics`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manual_scores` ADD CONSTRAINT `manual_scores_submission_id_submissions_id_fk` FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `manual_scores` ADD CONSTRAINT `manual_scores_assessor_id_users_id_fk` FOREIGN KEY (`assessor_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompt_versions` ADD CONSTRAINT `prompt_versions_rubric_id_rubrics_id_fk` FOREIGN KEY (`rubric_id`) REFERENCES `rubrics`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scenarios` ADD CONSTRAINT `scenarios_created_by_id_users_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_assessment_id_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_candidate_id_users_id_fk` FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_scenario_id_scenarios_id_fk` FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `ai_requests_submission_idx` ON `ai_requests` (`submission_id`);--> statement-breakpoint
CREATE INDEX `ai_requests_status_idx` ON `ai_requests` (`status`);--> statement-breakpoint
CREATE INDEX `assessments_candidate_idx` ON `assessments` (`candidate_id`);--> statement-breakpoint
CREATE INDEX `assessments_scenario_idx` ON `assessments` (`scenario_id`);--> statement-breakpoint
CREATE INDEX `assessments_status_idx` ON `assessments` (`status`);--> statement-breakpoint
CREATE INDEX `assessments_session_idx` ON `assessments` (`session_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_actor_idx` ON `audit_logs` (`actor_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_action_idx` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `audit_logs_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `evaluations_status_idx` ON `evaluations` (`status`);--> statement-breakpoint
CREATE INDEX `evaluations_grade_idx` ON `evaluations` (`grade`);--> statement-breakpoint
CREATE INDEX `manual_scores_submission_idx` ON `manual_scores` (`submission_id`);--> statement-breakpoint
CREATE INDEX `manual_scores_assessor_idx` ON `manual_scores` (`assessor_id`);--> statement-breakpoint
CREATE INDEX `prompt_versions_active_idx` ON `prompt_versions` (`active`);--> statement-breakpoint
CREATE INDEX `rubrics_active_idx` ON `rubrics` (`active`);--> statement-breakpoint
CREATE INDEX `scenarios_active_idx` ON `scenarios` (`active`);--> statement-breakpoint
CREATE INDEX `scenarios_difficulty_idx` ON `scenarios` (`difficulty`);--> statement-breakpoint
CREATE INDEX `scenarios_category_idx` ON `scenarios` (`category`);--> statement-breakpoint
CREATE INDEX `submissions_candidate_idx` ON `submissions` (`candidate_id`);--> statement-breakpoint
CREATE INDEX `submissions_scenario_idx` ON `submissions` (`scenario_id`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role_id`);