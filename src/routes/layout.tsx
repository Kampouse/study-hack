import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import MainHeader from "../components/header/Mainheader";
import { tursoClient } from "~/utils/turso";
type Session = {
  name: String;
  user: { email: string; name: string; image: string };
};
export const onGet: RequestHandler = async (event) => {
  const session: Session | null = event.sharedMap.get("session");
  if (session) {
    const Client = tursoClient(event);
    const result = await Client.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [session.user.email],
    });
    if (result.rows.length == 0) {
      const result = await Client.execute({
        sql: "INSERT INTO Users (email, name, username, ImageURL, IsAdmin) VALUES (?, ?, ?, ?, ?)",
        args: [
          session.user.email,
          session.user.name,
          session.user.name,
          session.user.image,
          0,
        ],
      });
      console.log("result->", result);
    }

    if (result.rows.length > 0) {
      event.sharedMap.set("PlatformSession", {
        Session: session,
        token: "",
        isAdmin: result.rows[0].IsAdmin,
      });
    }
  }

  //if there is no platform session, we need to create one
  //we can create a new session with the user data
  //detect if the user is new or not and create the platform

  //make a Platform session where  we can store the session data with more data from the user

  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  event.cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
  //if (url.pathname == "/" && session) throw redirect(302, "/app");
};

export default component$(() => {
  return (
    <div class="">
      <div class="">
        <MainHeader />
      </div>
      <Slot />
    </div>
  );
});
