import { tursoClient as drizzle } from "../src/utils/turso";
import {
  CreateUser,
  CreateEvent,
  updateRequestStatus,
  createJoinRequest,
  GetUserFromEmail,
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
  let input = await CreateUser({
    event: undefined,
    session: example,
    client: db,
  });
  if (input == null) {
    return;
  }
  if (Array.isArray(input)) {
    input = input[0];
  }

  const data = await GetUserFromEmail({
    event: undefined,
    email: input.Email,
    client: db,
  });
  console.log("Data:", data);

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
      ID: data?.ID ?? 0,
      Name: data?.Name ?? "",
      Intrests: data?.Intrests ?? "",
      Description: data?.Description ?? "",
      Image: data?.ImageURL ?? "",
    },
    Client: db,
  });

  if (data2 === undefined || data2 === null) {
    console.log("Event creation failed");
    return;
  }
  const requestData = {
    eventId: data2[0].EventID,
    userId: data?.ID ?? 0,
    background: "what up",
    experience: " whatup",
    why: "whatup",
  };

  const joinRequestResult = await createJoinRequest({
    event: undefined,
    requestData,
    client: db,
  });

  // Test update query
  const updateResult = await updateRequestStatus({
    event: undefined,
    requestId: joinRequestResult.data?.RequestID ?? 0,
    newStatus: "confirmed",
    client: db,
  });
  console.log("Update Result:", updateResult);
  console.log("Join Request Result:", joinRequestResult);
  console.log("Join Request Result:", updateResult);
};
main();
