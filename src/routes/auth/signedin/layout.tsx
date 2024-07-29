import type { RequestHandler } from "@builder.io/qwik-city";
import { tursoClient as drizzle } from "~/utils/turso";
import { users } from "~/../drizzle/schema";
import { eq } from "drizzle-orm";

type Session = {
  name: String;
  user: { email: string; name: string; image: string };
};

export const onRequest: RequestHandler = async (event) => {
  const session: Session | null = event.sharedMap.get("session");
  //get env vairables
  const url = event.env.get("PRIVATE_TURSO_DATABASE_URL");
  const token = event.env.get("PRIVATE_TURSO_AUTH_TOKEN");
  if (session) {
    const Client = drizzle({
      url: url,
      authToken: token,
    });

    const data = await Client.select()
      .from(users)
      .where(eq(users.Email, session.user.email));
    if (data.length == 0) {
      await Client.insert(users)
        .values({
          Email: session.user.email,
          Name: session.user.name,
          Username: session.user.name,
          ImageURL: session.user.image,
          IsAdmin: false,
        })
        .execute();
    }
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
