import { tursoClient as drizzle } from "../src/utils/turso.ts";
import { QueryEvents } from "../src/helpers/query.ts"
import { Event } from "./schema.ts";



const main = async () => {
  const db = drizzle({
    url: process.env.PRIVATE_TURSO_DATABASE_URL,
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
  });

  const data = await QueryEvents(undefined, {
    client: db,
  }) as Event[]




}
main()
