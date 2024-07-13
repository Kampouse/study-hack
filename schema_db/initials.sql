BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    ImageURL TEXT,
    IsAdmin BOOLEAN NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Sessions (
    SessionID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    SessionToken TEXT NOT NULL UNIQUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpiresAt TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

--INSERT INTO Users (email, Name, username, ImageURL, IsAdmin)
--VALUES ('jpmartel98@gmail.com', 'Jean-philippe Martel', --'jean-philippe', --'https://avatars.githubusercontent.com/u/41765025?v=4', 1)
--ON CONFLICT (Username) DO NOTHING;

COMMIT;
