CREATE TABLE `Places` (
	`PlaceID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Name` text NOT NULL,
	`Address` text NOT NULL,
	`Description` text NOT NULL,
	`ImageUrl` text,
	`Tags` text,
	`Rating` integer NOT NULL,
	`WifiSpeed` integer,
	`HasQuietEnvironment` integer,
	`IsPublic` integer DEFAULT 1 NOT NULL,
	`CreatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`UserID` integer NOT NULL,
	FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON UPDATE no action ON DELETE no action
);
