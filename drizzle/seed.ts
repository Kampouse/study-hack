import { tursoClient as drizzle } from "../src/utils/turso";
import { CreateUser, CreateEvent } from "../src/api/Query";

import type { CreateEventForm } from "~/api/Forms";
import type { Session } from "../src/api/drizzled";

import { faker } from "@faker-js/faker";
import { Events, Users } from "./schema";
import { createEventForm } from "~/api/Forms";

const db = drizzle({
  url: "file:./local.db",
  authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
});

const createRandomUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
  };
};

const createMultipleUsers = (count: number) => {
  return Array.from({ length: count }, createRandomUser);
};

const createRandomEvent = (userId: number) => {
  createEventForm;
  type RandomEvent = CreateEventForm;

  const randomEvent: RandomEvent = {
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
    ],
  } satisfies RandomEvent;

  return randomEvent;
};

const createMultipleEvents = (count: number, userId: number) => {
  return Array.from({ length: count }, () => createRandomEvent(userId));
};

const insertManyEvents = async (
  events: ReturnType<typeof createRandomEvent>[],
  userData: {
    ID: number;
    Name: string;
    Intrests: string;
    Description: string;
    Image: string;
  },
) => {
  for (const event of events) {
    await CreateEvent({
      event: undefined,
      session: event,
      userData: userData,
      Client: db,
    });
  }
};

const insertManyUsers = async (
  users: ReturnType<typeof createRandomUser>[],
) => {
  const insertedUsers = [];
  for (const user of users) {
    const result = await CreateUser({
      event: undefined,
      session: {
        name: "test",
        user: user,
      },
      client: db,
    });
    insertedUsers.push(result);
  }
  return insertedUsers;
};
type SeedUsers = Awaited<ReturnType<typeof insertManyUsers>>;

const applyUsers = async () => {
  const existingUsers = await db.select().from(Users);
  if (existingUsers.length === 0) {
    console.log("adding users....");
    const data = await insertManyUsers(createMultipleUsers(10));

    return await db.select().from(Users);
  } else {
    const data = await db.select().from(Users);

    if (data && data != null) {
      return data;
    }
    return [];
  }
};

type ApplyUsers = Awaited<ReturnType<typeof applyUsers>>;

const applyEvents = async (users: ApplyUsers) => {
  const existingEvents = await db.select().from(Events);
  if (existingEvents.length === 0 && users && users.length > 0) {
    console.log("adding events....");
    for (let i = 0; i < users.length; i++) {
      if (Math.random() > 0.3) {
        // 70% chance to create events for a user
        const numEvents = Math.floor(Math.random() * 5) + 1; // 1 to 5 events per user
        const events = createMultipleEvents(numEvents, users[i].UserID);
        await insertManyEvents(events, {
          ID: users[i].UserID,
          Name: users[i].Name,
          Intrests: "being nice",
          Description: users[i].Description as string,
          Image: users[i].ImageURL as string,
        });
      }
    }
  } else {
    console.log("Events already exist in the database");
    return existingEvents;
  }
};

const main = async () => {
  // Check if there are any users in the database
  const users = await applyUsers();

  applyEvents(users);
};

main();
