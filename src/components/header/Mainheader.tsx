import { component$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";
import { useLocation } from "@builder.io/qwik-city";
import { useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ArrowLeftIcon } from "lucide-qwik";
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
  const backSignal = useSignal<string | null>("/home");

  const urlStack = useSignal<string[]>([]);
  useTask$(({ track }) => {
    track(() => location.url);
    const currentUrl = location.url.pathname;
    if (currentUrl !== "/home") {
      if (
        urlStack.value.length === 0 ||
        urlStack.value[urlStack.value.length - 1] !== currentUrl
      ) {
        urlStack.value = [...urlStack.value, currentUrl];
      }
    } else {
      urlStack.value = ["/home"];
    }
    backSignal.value =
      urlStack.value.length > 1
        ? urlStack.value[urlStack.value.length - 2]
        : "/home";
  });
  return (
    <header class="h-fit w-full ">
      <nav
        class="flex w-full items-center justify-between shadow-sm"
        role="navigation"
      >
        <div class="flex flex-col items-center">
          <div class="pl-10 md:pl-8">
            <Link
              href={session.value ? "/home" : "/landing"}
              class="hidden p-4 text-2xl text-black md:inline-block"
            >
              <h1 class="inline-block">{"S & H"} </h1>
            </Link>

            {location.url.pathname === "/home" && (
              <Link
                href="/new"
                class="rounded-full bg-black px-3 py-2 text-white md:hidden"
              >
                New
              </Link>
            )}
            <Link href="/home" class="p-4 pl-5 text-white  md:hidden ">
              {location.url.pathname !== "/home" && (
                <div class="rounded-full bg-black px-3 py-2 ">
                  <ArrowLeftIcon size={24} />
                </div>
              )}
            </Link>
          </div>
          {!session.value && (
            <a href="/" class="hidden p-4">
              Learn more
            </a>
          )}
        </div>
        <div class="flex  flex-row content-center justify-end">
          {session.value && (
            <div class="flex items-center gap-4">
              {location.url.href.includes("home") ? (
                <div>
                  <Link
                    href="/new"
                    class="hidden rounded-full bg-black px-3 py-2 text-white md:block"
                  >
                    New
                  </Link>
                </div>
              ) : (
                <Link
                  href={backSignal.value || "/home"}
                  class="hidden rounded-full bg-black px-3 py-2 text-white md:block"
                >
                  <ArrowLeftIcon size={24} />
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
