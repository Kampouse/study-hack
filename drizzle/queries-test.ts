import { tursoClient as drizzle } from "../src/utils/turso";
import {
  CreateUser,
  CreateEvent,
  createJoinRequest,
} from "../src/helpers/query";

import type { Session } from "../src/helpers/drizzled";
import type { User } from "./schema";

const main = async () => {
  const db = drizzle({
    url: "file:./local.db",
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
  });

  const example = {
    name: "test",
    user: { email: "test", name: "test", image: "test" },
  } satisfies Session;
  const data = (await CreateUser({
    event: undefined,
    session: example,
    client: db,
  })) as User | undefined;
  console.log(data?.UserID);
  const data2 = await CreateEvent({
    event: undefined,
    session: {
      Name: "test",
      Description: "test",
      Date: "test",
      StartTime: "test",
      EndTime: "test",
      Location: "test",
      ImageURL: "hello",
      Coordinates: [0, 0],
    },
    userData: {
      ID: data?.UserID ?? 0,
      Name: data?.Name ?? "",
      Intrests: data?.Intrestets ?? "",
      Description: data?.Description ?? "",
      Image: data?.ImageURL ?? "",
    },
    Client: db,
  });

  if (data2 === undefined || data2 === null || data === undefined) {
    console.log("Event creation failed");
    return;
  }
  const requestData = {
    eventId: data2[0].EventID,
    userId: data.UserID,
    background: "",
    experience: "",
    why: "whatup",
  };

  const joinRequestResult = await createJoinRequest({
    event: undefined,
    requestData,
    client: db,
  });

  console.log("Join Request Result:", joinRequestResult);
};
main();