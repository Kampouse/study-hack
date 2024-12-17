import type { RequestEvent } from "@qwik.dev/router";
import { tursoClient as drizzle } from "~/utils/turso";
import type { RequestEventAction } from "@qwik.dev/router";
export type Session = {
  name: String;
  user: { email: string; name: string; image: string };
};

export type validDrizzler = ReturnType<typeof drizzle>;
export type Requested =
  | RequestEvent
  | RequestEventAction<QwikCityPlatform>
  | RequestEvent<QwikCityPlatform>;
export const drizzler = async (
  event: RequestEvent | RequestEventAction<QwikCityPlatform>,
) => {
  const session: Session | null = event.sharedMap.get("session");
  //get env vairables

  const islocal = event.env.get("LOCAL");

  const url = islocal
    ? "local.db"
    : event.env.get("PRIVATE_TURSO_DATABASE_URL");
  const token = event.env.get("PRIVATE_TURSO_AUTH_TOKEN");
  if (session) {
    const Client = drizzle({
      url: url,
      authToken: token,
    });
    return Client;
  }
  console.log("no session found ????????????");
  return null;
};
