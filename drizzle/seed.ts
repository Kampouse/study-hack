import { tursoClient } from "../src/utils/turso";
import {
  CreateUser,
  CreateEvent,
  CreatePlace,
  createJoinRequest,
} from "../src/api/Query";
import { Places } from "./schema";

import type { CreateEventForm, PlaceForm } from "~/api/Forms";

import { faker } from "@faker-js/faker";
import { Events, Requests, Users } from "./schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import assert from "assert";
type SelectedEvent = typeof Events.$inferSelect;

type TursoClient = ReturnType<typeof tursoClient>;

export const InjecatbleSeedScript = async (
  maybeDb?: TursoClient | undefined,
) => {
  if (maybeDb) {
    migrate(maybeDb as any, {
      migrationsFolder: "./drizzle/drizzle/migrations",
    });
  }

  const db =
    maybeDb ??
    tursoClient({
      url: "file:../local.db?mode=memory&cache=shared",
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
        faker.number.float({ min: 45.4, max: 45.7 }),
        faker.number.float({ min: -73.9, max: -73.4 }),
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
      Intrests: string[];
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

  const createRandomPlaces = (): PlaceForm => {
    const randomPlace: PlaceForm = {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(),
      tags: Array.from({ length: 3 }, () => faker.word.noun()),
      rating: faker.number.float({ min: 1, max: 5 }).toString(),
      wifispeed: faker.number.float({ min: 1, max: 100 }),
      hasquietenvironment: faker.datatype.boolean(),
      price: ["$", "$$", "$$$"][Math.floor(Math.random() * 3)],
      coordinates: [
        faker.number.float({ min: 45.4, max: 45.7 }),
        faker.number.float({ min: -73.9, max: -73.4 }),
      ],
      category: ["Workspace", "Café", "Library"][Math.floor(Math.random() * 3)],
    };
    return randomPlace;
  };

  const createMultiplePlaces = (count: number) => {
    return Array.from({ length: count }, () => createRandomPlaces());
  };

  const applyPlaces = async (users: ApplyUsers) => {
    const existingPlaces = await db.select().from(Places);

    if (existingPlaces.length === 0 && users.length > 0) {
      for (const user of users) {
        assert(user);

        const numPlaces = Math.floor(Math.random() * 5) + 1;
        const places = createMultiplePlaces(numPlaces);
        for (const place of places) {
          await CreatePlace({
            event: undefined,
            userID: user.UserID,
            placeData: place,
            client: db,
          });
        }
      }
      console.log("adding places....:✅");

      return db.select().from(Places);
    } else {
      console.log("Places already exist in the database:✅");
      return existingPlaces;
    }
  };

  type ApplyPlaces = Awaited<ReturnType<typeof applyPlaces>>;
  const applyEvents = async (users: ApplyUsers, places: ApplyPlaces) => {
    const existingEvents = await db.select().from(Events);
    if (existingEvents.length === 0 && users.length > 0) {
      console.log("adding events....:✅");

      for (let i = 0; i < users.length; i++) {
        const numEvents = Math.floor(Math.random() * 25) + 1; // 1 to 5 events per user
        const events = createMultipleEvents(numEvents);

        const eventWithPlace = events.map((event) => {
          const randomPlace = faker.helpers.arrayElement(places);
          console.log("randomPlace", randomPlace.PlaceID);
          return {
            ...event,
            PlaceId: randomPlace.PlaceID,
          };
        });

        await insertManyEvents(eventWithPlace, {
          ID: users[i].UserID,
          Name: users[i].Name,
          Intrests: ["hi", "bye"],
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

    const places = await applyPlaces(users);
    const events = await applyEvents(users, places);
    const requests = await applyRequests(users, events);
    return {
      users: users,
      events: events,
      requests: requests,
      places: places,
    };
  };

  await DrizzleSeedTest();
};
if (process.env.LOCAL === "true") {
  InjecatbleSeedScript();
}
