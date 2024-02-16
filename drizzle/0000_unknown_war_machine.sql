CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL
);
