import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import MainHeader from "../components/header/Mainheader";

export const onGet: RequestHandler = async ({
  cacheControl,
  redirect,
  url,
  sharedMap,
}) => {
  const session: Session | null = sharedMap.get("session");
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
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
      <div class="mb-32">
        <MainHeader />
      </div>
      <Slot />
    </div>
  );
});
