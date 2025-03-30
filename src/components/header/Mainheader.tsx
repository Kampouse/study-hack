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
    <header class="fixed top-0 z-50 h-fit w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <nav
        class=" mx-auto flex w-full items-center justify-between px-4 py-3"
        role="navigation"
      >
        <div class="flex items-center gap-4">
          <Link
            href={session.value ? "/home" : "/landing"}
            class="hidden bg-gradient-to-r from-primary to-primary bg-clip-text px-1 text-xl font-bold text-transparent transition-colors hover:from-primary/90 hover:to-primary/90 md:block"
          >
            Just R&D
          </Link>

          {location.url.pathname === "/home" && (
            <Link
              href="/new"
              class="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg md:hidden"
            >
              Start New Session
            </Link>
          )}
          {session.value && location.url.pathname !== "/home" && (
            <Link
              href="/home"
              class="rounded-lg bg-secondary p-2 text-secondary-foreground shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg md:hidden"
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
                  class="hidden rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg md:block"
                >
                  Start New Session
                </Link>
              ) : (
                <Link
                  href="/home"
                  class="hidden rounded-lg bg-secondary p-2 text-secondary-foreground shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg md:block"
                >
                  <ArrowLeftIcon size={20} />
                </Link>
              )}
              {location.url.pathname !== "/profile" && (
                <Link
                  prefetch="js"
                  href="/profile"
                  class="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg"
                >
                  My Profile
                </Link>
              )}
              <Dropdown />
            </>
          ) : (
            <Link
              href="/login"
              class="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg"
            >
              Get Started
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
});
