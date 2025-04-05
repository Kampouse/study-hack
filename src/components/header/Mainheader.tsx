import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
export default component$(() => {

  return (
    true && (
      <header class="fixed top-0 z-50 h-fit w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <nav
          class=" mx-auto flex w-full items-center justify-between px-4 py-3"
          role="navigation"
        >
          <div class="flex items-center gap-4">
            <Link
              href={"/landing"}
              class="hidden bg-gradient-to-r from-primary to-primary bg-clip-text px-1 text-xl font-bold text-transparent transition-colors hover:from-primary/90 hover:to-primary/90 md:block"
            >
              Just R&D
            </Link>
          </div>

          <div class="flex items-center gap-4">
            <Link
              href="/profile"
              class="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all duration-300 hover:bg-secondary/90 hover:shadow-lg md:hidden"
            >
              Profile
            </Link>








          </div>
        </nav>
      </header>
    )
  );
});
