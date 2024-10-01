import { tursoClient as drizzle } from "../src/utils/turso";
import { CreateUser, CreateEvent, createJoinRequest } from "../src/api/Query";

import type { CreateEventForm } from "~/api/Forms";
import type { Session } from "../src/api/drizzled";

import { faker } from "@faker-js/faker";
import { Events, Requests, Users } from "./schema";
import { createEventForm } from "~/api/Forms";
type SelectedEvent = typeof Events.$inferSelect;

type TursoClient = ReturnType<typeof drizzle>;


export const InjecatbleSeedScript = async (maybeDb?: TursoClient | undefined) => {

  const db = maybeDb ?? drizzle({
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

  const createRandomJoinRequest = (userId: number, eventId: number) => {
    return {
      UserID: userId,
      EventID: eventId,
      Status: "Pending",
      Message: faker.lorem.sentence(),
      CreatedAt: faker.date.past().toISOString(),
    };
  };

  const applyRequests = async (users: ApplyUsers, events: SelectedEvent[]) => {
    const requests = [];
    for (let i = 0; i < 20; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const randomEvent = faker.helpers.arrayElement(events);
      const request = createRandomJoinRequest(
        randomUser.UserID,
        randomEvent.EventID,
      );
      requests.push(request);
    }
    // Check if there are already existing requests for each user-event pair
    const existingRequests = await db.select().from(Requests);
    if (existingRequests.length > 0) {
      console.log("Request already exist in the database:✅");
      return existingRequests;
    }

    for (const request of requests) {
      await createJoinRequest({
        event: undefined,
        requestData: {
          eventId: request.EventID,
          userId: request.UserID,
          background: faker.lorem.paragraph(),
          experience: faker.lorem.sentence(),
          why: faker.lorem.paragraph(),
        },
        client: db,
      });
    }
    console.log("adding join requests....:✅");
    return db.select().from(Requests);
  };

  const createRandomEvent = () => {
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

  const createMultipleEvents = (count: number) => {
    return Array.from({ length: count }, () => createRandomEvent());
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

  const applyUsers = async () => {
    const existingUsers = await db.select().from(Users);
    if (existingUsers.length === 0) {
      console.log("adding users....:✅");
      await insertManyUsers(Array.from({ length: 10 }, createRandomUser));
      return db.select().from(Users);
    } else {
      console.log("Users already exist in the database:✅");
      return await db.select().from(Users);
    }
  };

  type ApplyUsers = Awaited<ReturnType<typeof applyUsers>>;

  const applyEvents = async (users: ApplyUsers) => {
    const existingEvents = await db.select().from(Events);
    if (existingEvents.length === 0 && users.length > 0) {
      console.log("adding events....:✅");

      for (let i = 0; i < users.length; i++) {
        const numEvents = Math.floor(Math.random() * 5) + 1; // 1 to 5 events per user
        const events = createMultipleEvents(numEvents);

        await insertManyEvents(events, {
          ID: users[i].UserID,
          Name: users[i].Name,
          Intrests: "being nice",
          Description: users[i].Description as string,
          Image: users[i].ImageURL as string,
        });
        return db.select().from(Events);
      }
    } else {
      console.log("Events already exist in the database:✅");
      return existingEvents;
    }
    return existingEvents;
  };

  const DrizzleSeedTest = async () => {
    // Check if there are any users in the database
    const users = await applyUsers();
    const events = await applyEvents(users);
    const requests = await applyRequests(users, events);
    return {
      users: users,
      events: events,
      requests: requests

    }
  };
  await DrizzleSeedTest();
}


//InjecatbleSeedScript()
