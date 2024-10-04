import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as Schema from "~/../drizzle/schema";
import Database from "better-sqlite3";
import { InjecatbleSeedScript } from "../../drizzle/seed";

import { expect, test, beforeAll } from "vitest";
import { CreateEvent, CreateUser, GetUserFromEmail } from "./Query";

import { faker } from "@faker-js/faker";
const sqlite = new Database(":memory:");
const db = drizzle(sqlite, {
  schema: Schema,
});

//await runMigration(db);

beforeAll(async () => {
  //const db = await runMigration().catch(console.error);
  // console.log("db", db);

  migrate(db, { migrationsFolder: "./drizzle/drizzle/migrations" });

  await InjecatbleSeedScript(db as any);
});

test("validate data", async () => {
  // Run migration first

  // Test if seed script was executed successfully
  // You might want to check for specific data or table contents here
  // For example:
  try {
    const users = await db.select().from(Schema.Users);
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  } catch (error) {
    console.error(error);
  }
});
test("Create a valid user", async () => {
  const result = await CreateUser({
    event: undefined,
    session: {
      name: "test",
      user: {
        name: "Kampouse",
        email: "jpmartel98@gmail.com",
        image: "somthing",
      },
    },
    client: db as any,
  });
  expect(result).toBeDefined();
});

test("Get user from email", async () => {
  const user = await GetUserFromEmail({
    event: undefined,
    email: "jpmartel98@gmail.com",
    client: db as any,
  });
  expect(user).toBeDefined();
  expect(user?.Email).toBe("jpmartel98@gmail.com");
});

test("add valid event from user", async () => {
  const event = {
    Name: faker.lorem.words(3),
    Description: faker.lorem.paragraph(),
    Date: faker.date.future().toISOString().split("T")[0],
    StartTime: faker.date.future().toLocaleTimeString(),
    EndTime: faker.date.future().toLocaleTimeString(),
    Location: faker.location.city(),
    ImageURL: faker.image.url() as string,
    Coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  };
  const user = await GetUserFromEmail({
    event: undefined,
    email: "jpmartel98@gmail.com",
    client: db as any,
  });

  type userData = {
    ID: number;
    Name: string;
    Intrests: string;
    Description: string;
    Image: string;
  };

  const userData = {
    ID: user?.ID as number,
    Name: user?.Name as string,
    Intrests: user?.Intrests as string,
    Description: user?.Description as string,
    Image: user?.ImageURL as string,
  };

  const output = await CreateEvent({
    event: undefined,
    session: event,
    userData: userData,
    Client: db as any,
  });
  expect(output).toBeDefined();
  if (output) {
    expect(output[0]).toHaveProperty("EventID");
  }
});
