import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as Schema from "~/../drizzle/schema";
import Database from "better-sqlite3";
import { InjecatbleSeedScript } from "../../drizzle/seed";

import { expect, test, beforeAll } from "vitest";
import {
  CreateEvent,
  CreateUser,
  QueryAllReferenceEvents,
  GetUserFromEmail,
  createJoinRequest,
  updateRequestStatus,
} from "./Query";

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

test("Create a join request", async () => {
  // First, create a user
  await CreateUser({
    event: undefined,
    session: {
      name: "Requester",
      user: {
        name: "Requester",
        email: "requester@example.com",
        image: "requester_image.jpg",
      },
    },
    client: db as any,
  });
  const queriedUser = await GetUserFromEmail({
    event: undefined,
    email: "requester@example.com",
    client: db as any,
  });

  expect(queriedUser).toBeDefined();
  expect(queriedUser?.Email).toBe("requester@example.com");

  // Now, create an event
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

  const createdEvent = await CreateEvent({
    event: undefined,
    session: event,
    userData: queriedUser as any,
    Client: db as any,
  });

  expect(createdEvent).toBeDefined();
  expect(createdEvent?.[0]).toHaveProperty("EventID");

  // Now, create a join request
  const joinRequest = await createJoinRequest({
    event: undefined,
    requestData: {
      eventId: createdEvent?.[0].EventID as number,
      userId: queriedUser?.ID as number,
      background: faker.lorem.paragraph(),
      experience: faker.lorem.paragraph(),
      why: faker.lorem.paragraph(),
    },
    client: db as any,
  });

  expect(joinRequest).toBeDefined();
  expect(joinRequest.success).toBe(true);
  expect(joinRequest.data).toHaveProperty("RequestID");
  expect(joinRequest.data?.EventID).toBe(createdEvent?.[0].EventID);
  expect(joinRequest.data?.UserID).toBe(queriedUser?.ID);

  // Update the request status
  const updatedRequest = await updateRequestStatus({
    event: undefined,
    requestId: joinRequest.data?.RequestID as number,
    newStatus: "confirmed",
    client: db as any,
  });

  expect(updatedRequest).toBeDefined();
  expect(updatedRequest.success).toBe(true);
  expect(updatedRequest.data?.Status).toBe("confirmed");
});
test("QueryAllReferenceEvents - various scenarios", async () => {
  // Create users
  await CreateUser({
    event: undefined,
    session: {
      name: "User1",
      user: {
        name: "User1",
        email: "user1@example.com",
        image: "user1_image.jpg",
      },
    },
    client: db as any,
  });

  await CreateUser({
    event: undefined,
    session: {
      name: "User2",
      user: {
        name: "User2",
        email: "user2@example.com",
        image: "user2_image.jpg",
      },
    },
    client: db as any,
  });

  // Get users from email
  const user1 = await GetUserFromEmail({
    event: undefined,
    email: "user1@example.com",
    client: db as any,
  });

  const user2 = await GetUserFromEmail({
    event: undefined,
    email: "user2@example.com",
    client: db as any,
  });

  expect(user1).toBeDefined();
  expect(user2).toBeDefined();

  // Create an event
  const event = {
    Name: "Test Event",
    Description: "This is a test event",
    Date: new Date().toISOString().split("T")[0],
    StartTime: "10:00:00",
    EndTime: "12:00:00",
    Location: "Test Location",
    ImageURL: "test_image.jpg",
    Coordinates: [0, 0] as [number, number],
  };

  const createdEvent = await CreateEvent({
    event: undefined,
    session: event,
    userData: user1 as any,
    Client: db as any,
  });
  await CreateEvent({
    event: undefined,
    session: event,
    userData: user2 as any,
    Client: db as any,
  });

  expect(createdEvent).toBeDefined();
  expect(createdEvent?.[0]).toHaveProperty("EventID");

  // Create a join request
  const joinRequest = await createJoinRequest({
    event: undefined,
    requestData: {
      eventId: createdEvent?.[0].EventID as number,
      userId: user2?.ID as number,
      background: "Test background",
      experience: "Test experience",
      why: "Test reason",
    },
    client: db as any,
  });

  expect(joinRequest).toBeDefined();
  expect(joinRequest.success).toBe(true);
  const data_from_user1 = await QueryAllReferenceEvents({
    event: undefined as any,
    UserID: user1?.ID as number,
    options: {
      client: db as any,
    },
  });
  expect(data_from_user1).toBeDefined();
  expect(data_from_user1?.host.length).toBeGreaterThanOrEqual(1);

  const data_from_user2 = await QueryAllReferenceEvents({
    event: undefined as any,
    UserID: user2?.ID as number,
    options: {
      client: db as any,
    },
  });
  expect(data_from_user2).toBeDefined();
  expect(data_from_user2?.attendie.length).toBeGreaterThanOrEqual(1);
  expect(data_from_user2?.host.length).toBeGreaterThanOrEqual(1);
});
