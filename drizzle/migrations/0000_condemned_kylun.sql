CREATE TABLE `Events` (
	`EventID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Name` text NOT NULL,
	`Description` text NOT NULL,
	`Location` text NOT NULL,
	`Coordinates` text NOT NULL,
	`StartTime` text NOT NULL,
	`EndTime` text NOT NULL,
	`Tags` text NOT NULL,
	`date` integer NOT NULL,
	`CreatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`UserID` integer NOT NULL
);

--> statement-breakpoint
ALTER TABLE `USERS` ADD COLUMN `Description` text;
--> statement-breakpoint
ALTER TABLE `USERS` ADD COLUMN `Intrestets` text DEFAULT '[]';
--> statement-breakpoint
CREATE UNIQUE INDEX `Sessions_SessionToken_unique` ON `Sessions` (`SessionToken`);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_Username_unique` ON `Users` (`Username`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_Email_unique` ON `Users` (`Email`);
