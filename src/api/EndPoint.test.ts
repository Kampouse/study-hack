import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as Schema from "~/../drizzle/schema";
import Database from "better-sqlite3";
import { InjecatbleSeedScript } from "../../drizzle/seed";

import { expect, test, beforeAll } from "vitest";
import {
  CreateEvent,
  CreateUser,
  CreatePlace,
  QueryPlace,
  QueryPlaces,
  UpdatePlace,
  DeletePlace,
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
    Username: user?.Username as string,
    Intrests: user?.Intrests as string[],
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
test("QueryAllReferenceEvents - validity of data", async () => {
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

  // Create events
  const event1 = {
    Name: "Test Event 1",
    Description: "This is test event 1",
    Date: new Date().toISOString().split("T")[0],
    StartTime: "10:00:00",
    EndTime: "12:00:00",
    Location: "Test Location 1",
    ImageURL: "test_image1.jpg",
    Coordinates: [0, 0] as [number, number],
  };

  const event2 = {
    Name: "Test Event 2",
    Description: "This is test event 2",
    Date: new Date().toISOString().split("T")[0],
    StartTime: "14:00:00",
    EndTime: "16:00:00",
    Location: "Test Location 2",
    ImageURL: "test_image2.jpg",
    Coordinates: [1, 1] as [number, number],
  };

  const createdEvent1 = await CreateEvent({
    event: undefined,
    session: event1,
    userData: user1 as any,
    Client: db as any,
  });

  const createdEvent2 = await CreateEvent({
    event: undefined,
    session: event2,
    userData: user2 as any,
    Client: db as any,
  });

  expect(createdEvent1).toBeDefined();
  expect(createdEvent1?.[0]).toHaveProperty("EventID");
  expect(createdEvent2).toBeDefined();
  expect(createdEvent2?.[0]).toHaveProperty("EventID");

  // Create join requests
  const joinRequest1 = await createJoinRequest({
    event: undefined,
    requestData: {
      eventId: createdEvent1?.[0].EventID as number,
      userId: user2?.ID as number,
      background: "Test background 1",
      experience: "Test experience 1",
      why: "Test reason 1",
    },
    client: db as any,
  });

  const joinRequest2 = await createJoinRequest({
    event: undefined,
    requestData: {
      eventId: createdEvent2?.[0].EventID as number,
      userId: user1?.ID as number,
      background: "Test background 2",
      experience: "Test experience 2",
      why: "Test reason 2",
    },
    client: db as any,
  });

  expect(joinRequest1).toBeDefined();
  expect(joinRequest1.success).toBe(true);
  expect(joinRequest2).toBeDefined();
  expect(joinRequest2.success).toBe(true);

  // Query all reference events for user1
  const dataFromUser1 = await QueryAllReferenceEvents({
    event: undefined as any,
    UserID: user1?.ID as number,
    options: {
      client: db as any,
    },
  });

  expect(dataFromUser1).toBeDefined();
  expect(dataFromUser1).toBeInstanceOf(Array);
  expect(dataFromUser1?.length).toBeGreaterThanOrEqual(2);

  // Query all reference events for user2
  const dataFromUser2 = await QueryAllReferenceEvents({
    event: undefined as any,
    UserID: user2?.ID as number,
    options: {
      client: db as any,
    },
  });

  expect(dataFromUser2).toBeDefined();
  expect(dataFromUser2).toBeInstanceOf(Array);
  expect(dataFromUser2?.length).toBeGreaterThanOrEqual(2);
});
test("Create a valid place", async () => {
  const user = await GetUserFromEmail({
    event: undefined,
    email: "jpmartel98@gmail.com",
    client: db as any,
  });

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    image: faker.image.url(),
    description: faker.lorem.paragraph(),
    tags: [faker.word.sample(), faker.word.sample()],
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    wifispeed: faker.number.int({ min: 1, max: 100 }),
    hasquietenvironment: faker.datatype.boolean(),
    price: "$".repeat(faker.number.int({ min: 1, max: 3 })),
    category: faker.word.sample(),
  };

  const result = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: db as any,
  });

  expect(result).toBeDefined();
  expect(result.success).toBe(true);
  expect(result.data).toHaveProperty("PlaceID");
});

test("Query a specific place", async () => {
  // First create a place
  const user = await GetUserFromEmail({
    event: undefined,
    email: "jpmartel98@gmail.com",
    client: db as any,
  });

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    description: faker.lorem.paragraph(),
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  };

  const createdPlace = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: db as any,
  });
  expect(createdPlace).toBeDefined();
  if (!createdPlace.data) {
    throw new Error("Failed to create place");
  }

  const result = await QueryPlace({
    event: undefined,
    placeId: createdPlace.data.PlaceID,
    client: db as any,
  });
  if (!result.success || !result.data) {
    throw new Error("Failed to query place");
  }

  expect(result).toBeDefined();
  expect(result.success).toBe(true);
  expect(result.data.Name).toBe(placeData.name);
});

test("Query all places", async () => {
  const result = await QueryPlaces({
    event: undefined,
    client: db as any,
  });

  expect(result).toBeDefined();
  expect(result.success).toBe(true);
});

test("Update a place", async () => {
  // First create a place
  const user = await GetUserFromEmail({
    event: undefined,
    email: "jpmartel98@gmail.com",
    client: db as any,
  });

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    description: faker.lorem.paragraph(),
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  };

  const createdPlace = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: db as any,
  });

  const updateData = {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
  };
  if (!createdPlace.data) {
    throw new Error("Failed to create place");
  }

  const result = await UpdatePlace({
    event: undefined,
    placeId: createdPlace.data.PlaceID,
    placeData: updateData,
    client: db as any,
  });
  if (!result.success || !result.data) {
    throw new Error("Failed to update place");
  }
  expect(result).toBeDefined();
  expect(result.success).toBe(true);
  expect(result.data.Name).toBe(updateData.name);
});

test("Delete a place", async () => {
  // First create a place
  const user = await GetUserFromEmail({
    event: undefined,
    email: "jpmartel98@gmail.com",
    client: db as any,
  });

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    description: faker.lorem.paragraph(),
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  };

  const createdPlace = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: db as any,
  });
  if (!createdPlace.data) {
    throw new Error("Failed to create place");
  }

  const result = await DeletePlace({
    event: undefined,
    placeId: createdPlace.data.PlaceID,
    client: db as any,
  });

  expect(result).toBeDefined();
  expect(result.success).toBe(true);
});
