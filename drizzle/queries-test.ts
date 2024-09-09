import { tursoClient as drizzle } from "../src/utils/turso.ts";
import { QueryEvents, CreateUser } from "../src/helpers/query.ts";

import { Session } from "../src/helpers/drizzled.ts";
import { Event, User } from "./schema.ts";

const main = async () => {
  const db = drizzle({
    url: "file:./local.db",
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
  });





  const example = {
    name: "test",
    user: { email: "test", name: "test", image: "test" },

  } satisfies Session
  const user = await CreateUser(undefined, example, db) as User;





}



main();
