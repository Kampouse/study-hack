CREATE TABLE `Events` (
	`EventID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Name` text NOT NULL,
	`Description` text NOT NULL,
	`Location` text NOT NULL,
	`ImageUrl` text,
	`Coordinates` text NOT NULL,
	`Date` text NOT NULL,
	`StartTime` text NOT NULL,
	`PlaceId` integer,
	`EndTime` text NOT NULL,
	`Tags` text NOT NULL,
	`CreatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`UserID` integer NOT NULL,
	FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Places` (
	`PlaceID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Name` text NOT NULL,
	`Address` text NOT NULL,
	`ImageUrl` text,
	`Description` text NOT NULL,
	`Tags` text,
	`Rating` integer DEFAULT 0 NOT NULL,
	`WifiSpeed` integer,
	`HasQuietEnvironment` integer,
	`Price` text,
	`Coordinates` text,
	`Category` text,
	`IsPublic` integer DEFAULT 1 NOT NULL,
	`CreatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`UserID` integer NOT NULL,
	FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Requests` (
	`RequestID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`EventID` integer NOT NULL,
	`UserID` integer NOT NULL,
	`Status` text DEFAULT 'pending' NOT NULL,
	`Background` text,
	`Experience` text,
	`WhyJoin` text,
	`CreatedAt` text DEFAULT 'sql`(CURRENT_TIMESTAMP)`',
	FOREIGN KEY (`EventID`) REFERENCES `Events`(`EventID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON UPDATE no action ON DELETE no action
);
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
CREATE UNIQUE INDEX `Requests_EventID_UserID_unique` ON `Requests` (`EventID`,`UserID`);--> statement-breakpoint
CREATE UNIQUE INDEX `Sessions_SessionToken_unique` ON `Sessions` (`SessionToken`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_Email_unique` ON `Users` (`Email`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_Username_unique` ON `Users` (`Username`);