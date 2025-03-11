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
        disable_external_dependency_loading: true,
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
        class="container mx-auto flex w-full items-center justify-between px-4 py-3"
        role="navigation"
      >
        <div class="flex items-center gap-4">
          <Link
            href={session.value ? "/home" : "/landing"}
            class="hidden bg-gradient-to-r from-neutral-700 to-neutral-900 bg-clip-text text-xl font-semibold text-transparent transition-colors hover:from-neutral-800 hover:to-neutral-950 md:block"
          >
            Justd R&D
          </Link>

          {location.url.pathname === "/home" && (
            <Link
              href="/new"
              class="rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-neutral-800 hover:to-neutral-900 hover:shadow-md md:hidden"
            >
              New Session
            </Link>
          )}
          {session.value && location.url.pathname !== "/home" && (
            <Link
              href="/home"
              class="rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 p-2 text-white shadow-sm transition-all duration-300 hover:from-neutral-800 hover:to-neutral-900 hover:shadow-md md:hidden"
            >
              <ArrowLeftIcon size={20} />
            </Link>
          )}
        </div>

        <div class="flex items-center gap-4">
          {session.value ? (
            <>
              {location.url.href.includes("home") ? (
                <Link
                  href="/new"
                  class="hidden rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-neutral-800 hover:to-neutral-900 hover:shadow-md md:block"
                >
                  New Session
                </Link>
              ) : (
                <Link
                  href="/home"
                  class="hidden rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 p-2 text-white shadow-sm transition-all duration-300 hover:from-neutral-800 hover:to-neutral-900 hover:shadow-md md:block"
                >
                  <ArrowLeftIcon size={20} />
                </Link>
              )}
              {location.url.pathname !== "/profile" && (
                <Link
                  prefetch="js"
                  href="/profile"
                  class="rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-neutral-800 hover:to-neutral-900 hover:shadow-md"
                >
                  Profile
                </Link>
              )}
              <Dropdown />
            </>
          ) : (
            <Link
              href="/login"
              class="rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-neutral-800 hover:to-neutral-900 hover:shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
});
