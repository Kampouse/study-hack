import { tursoClient as drizzle } from "../src/utils/turso";
import {
  CreateUser,
  CreateEvent,
  updateRequestStatus,
  createJoinRequest,
  GetUserFromEmail,
  GetUser,
  User,
} from "../src/api/Query";

import type { Session } from "../src/api/drizzled";

import { faker } from "@faker-js/faker";
import { Users } from "./schema";

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
  return {
    Name: faker.lorem.words(3),
    Description: faker.lorem.paragraph(),
    Date: faker.date.future().toISOString().split("T")[0],
    StartTime: faker.date.future().toLocaleTimeString(),
    EndTime: faker.date.future().toLocaleTimeString(),
    Location: faker.location.city(),
    ImageURL: faker.image.url(),
    Coordinates: [0, 0],
    CreatorID: userId,
  };
};

const createMultipleEvents = (count: number, userId: number) => {
  return Array.from({ length: count }, () => createRandomEvent(userId));
};

const insertManyEvents = async (
  events: ReturnType<typeof createRandomEvent>[],
  db: any,
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
const applyUsers = async () => {
  const existingUsers = await db.select().from(Users);
  if (existingUsers.length === 0) {
    console.log("adding users....");
    await insertManyUsers(createMultipleUsers(10));
  } else {
    return await db.select().from(Users);
  }
};

const main = async () => {
  // Check if there are any users in the database
  applyUsers();
};

main();
