ALTER TABLE sessions ADD `session` text NOT NULL;
--> statement-breakpoint
ALTER TABLE sessions ADD `data` text NOT NULL;
--> statement-breakpoint
ALTER TABLE sessions ADD `expires` integer NOT NULL;
