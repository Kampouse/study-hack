import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";
import { useLocation } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import Dropdown from "@/components/dropdown";
import posthog from "posthog-js";
export default component$(() => {
  const session = useAuthSession();
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
  const location = useLocation();
  return (
    <header class="h-fit w-full ">
      <nav
        class="relative flex h-16 items-center font-mono  text-black shadow-sm md:justify-between"
        role="navigation"
      >
        <div class="pl-2   md:pl-8">
          <Link
            href={session.value ? "/home" : "/landing"}
            class=" hidden p-4 text-2xl md:inline "
          >
            {"S & H"}
          </Link>
        </div>
        <div class="flex  flex-row content-center justify-center">
          {!session.value && (
            <a href="/" class="p-4">
              Learn more
            </a>
          )}
          {session.value && (
            <div class="flex items-center gap-4">
              {location.url.href.includes("home") ? (
                <Link
                  href="/new"
                  class="rounded-full bg-black px-3 py-2 text-white"
                >
                  + Create event
                </Link>
              ) : (
                <Link
                  href="/home"
                  class="rounded-full bg-black px-3 py-2 text-white"
                >
                  Back to Dashboard
                </Link>
              )}
              {location.url.pathname !== "/profile" && (
                <Link
                  href="/profile"
                  class="rounded-full bg-black px-3 py-2 text-white"
                >
                  Profile
                </Link>
              )}{" "}
              <Dropdown />
            </div>
          )}

          {!session.value && (
            <a href="/login" class="p-4">
              Sign In
            </a>
          )}
        </div>
      </nav>
    </header>
  );
});
