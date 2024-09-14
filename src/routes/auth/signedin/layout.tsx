import type { RequestHandler } from "@builder.io/qwik-city";
import { CreateUser } from "~/api/Query";
import type { Session } from "~/api/drizzled";
export const onRequest: RequestHandler = async (event) => {
  const session: Session | null = event.sharedMap.get("session");

  if (session) {
    await CreateUser({ event: event, session: session });
    throw event.redirect(302, "/app");
  }
  throw event.redirect(302, `/`);
};

//if there is no platform session, we need to create one
//we can create a new session with the user data
//detect if the user is new or not and create the platform

//make a Platform session where  we can store the session data with more data from the user

// Control caching for this request for best performance and to reduce hosting costs:
// https://qwik.dev/docs/caching/

//if (url.pathname == "/" && session) throw redirect(302, "/app");
