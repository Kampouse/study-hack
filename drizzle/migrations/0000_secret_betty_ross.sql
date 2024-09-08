CREATE TABLE `Event` (
 `EventID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
 `Title` text NOT NULL,
 `Description` text,
 `StartDate` text NOT NULL,
 `EndDate` text,
 `Location` text,
 `CreatedAt` text DEFAULT CURRENT_TIMESTAMP,
 `EventUrl` text
);
ALTER TABLE `Event` ADD COLUMN `ImageUrl` text;
ALTER TABLE `date` RENAME TO `Date`;

--> statement-breakpoint
CREATE TABLE `Sessions` (
	`SessionID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`UserID` integer NOT NULL,
	`SessionToken` text NOT NULL,
	`CreatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`ExpiresAt` text,
	FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`UserID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Username` text NOT NULL,
	`Name` text DEFAULT '' NOT NULL,
	`Email` text NOT NULL,
	`ImageURL` text,
	`Description` text,
	`IsAdmin` integer DEFAULT 0 NOT NULL,
	`Intrestets` text DEFAULT '[]' NOT NULL,
	`CreatedAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Sessions_SessionToken_unique` ON `Sessions` (`SessionToken`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_Email_unique` ON `Users` (`Email`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_Username_unique` ON `Users` (`Username`);
