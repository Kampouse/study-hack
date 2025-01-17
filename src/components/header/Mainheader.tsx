import { component$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useSession } from "~/routes/plugin@auth";
import { useLocation } from "@builder.io/qwik-city";
import { useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ArrowLeftIcon } from "lucide-qwik";
import Dropdown from "@/components/dropdown";
import posthog from "posthog-js";
export default component$(() => {
  const session = useSession();
  //eslint-disable-next-line
  useVisibleTask$(() => {
    if (
      document.location.host.includes("study-hack.vercel.app") ||
      document.location.host.includes("justrnd.com")
    ) {
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
    <header class="fixed top-0 z-50 h-fit w-full bg-white/80 backdrop-blur-sm">
      <nav
        class=" flex w-full  items-center justify-between  py-3"
        role="navigation"
      >
        <div class="flex flex-col items-center">
          <div class="pl-10 md:pl-8">
            <Link
              href={session.value ? "/home" : "/landing"}
              class="hidden bg-gradient-to-r from-black to-gray-600 bg-clip-text p-4 text-2xl font-bold text-transparent transition-opacity hover:opacity-80 md:inline-block"
            >
              <h1 class="inline-block">{"R <&> D"} </h1>
            </Link>

            {location.url.pathname === "/home" && (
              <Link
                href="/new"
                class="overflow-hidden whitespace-nowrap rounded-full bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800 md:hidden"
              >
                New Session
              </Link>
            )}
            {session.value && (
              <Link href="/home" class="p-4 pl-5 text-white md:hidden">
                {location.url.pathname !== "/home" && (
                  <div class="rounded-full bg-black px-3 py-2 transition-colors hover:bg-gray-800">
                    <ArrowLeftIcon size={24} />
                  </div>
                )}
              </Link>
            )}
          </div>
          {!session.value && (
            <a
              href="/"
              class="hidden p-4 text-gray-600 transition-colors hover:text-black"
            >
              Learn more
            </a>
          )}
        </div>
        <div class="flex flex-row content-center justify-end">
          {session.value && (
            <div class="flex items-center gap-4">
              {location.url.href.includes("home") ? (
                <div>
                  <Link
                    href="/new"
                    class="hidden rounded-full bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800 md:block"
                  >
                    New Session
                  </Link>
                </div>
              ) : (
                <Link
                  href="/home"
                  class="hidden rounded-full bg-black px-3 py-2 text-white transition-colors hover:bg-gray-800 md:block"
                >
                  <ArrowLeftIcon size={24} />
                </Link>
              )}
              {location.url.pathname !== "/profile" && (
                <Link
                  prefetch="js"
                  href="/profile"
                  class="rounded-full bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
                >
                  Profile
                </Link>
              )}{" "}
              <Dropdown />
            </div>
          )}

          {!session.value && (
            <a
              href="/login"
              class="p-4 text-gray-600 transition-colors hover:text-black"
            >
              Sign In
            </a>
          )}
        </div>
      </nav>
    </header>
  );
});
