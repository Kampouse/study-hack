import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import MainHeader from "../components/header/Mainheader";
import { tursoClient } from "~/utils/turso";
import { useAuthSession } from "./plugin@auth";
type Session = {
  name: String;
  user: { email: string; name: string; image: string };
};
export const onGet: RequestHandler = async (event) => {
  const session: Session | null = event.sharedMap.get("session");

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
  const session = useAuthSession();
  return (
    <div class="">
      <div class="">
        <MainHeader />
      </div>
      {(session.value && <div> hello </div>) || <Slot />}
    </div>
  );
});
