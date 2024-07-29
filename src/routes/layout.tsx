import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import MainHeader from "../components/header/Mainheader";
import posthog from "posthog-js";
export const onGet: RequestHandler = async ({ sharedMap, redirect, request, pathname }) => {
  //if there is no platform session, we need to create one
  //we can create a new session with the user data
  //detect if the user is new or not and create the platform
  //make a Platform session where  we can store the session data with more data from the user
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  // event.cacheControl({
  // Always serve a cached response by default, up to a week stale
  // staleWhileRevalidate: 60 * 60 * 24 * 7,
  // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
  //    maxAge: 5,
  //});
  //if (url.pathname == "/" && session) throw redirect (302, "/app");
  const session = sharedMap.get("session")
  if (session && pathname == "/") {
    throw redirect(302, "/app");
  }
};

export default component$(() => {
  //eslint-disable-next-line
  useVisibleTask$(() => {
    if (document.location.host.includes("study-hack.vercel.app")) {
      posthog.init("phc_4TyE0DMk3m3zjsaAxXOKlPZAGeqBuuGrVxfTDUQCK74", {
        api_host: "https://us.i.posthog.com",
        capture_heatmaps: true,
        capture_pageview: true,
        capture_performance: true,
        disable_external_dependency_loading: true, // Optional - will ensure we never try to load extensions lazily
      });
    }
  });

  return (
    <div class="">
      <div class="">
        <MainHeader />
      </div>
      <Slot />
    </div>
  );
});
