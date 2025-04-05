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
              href={"/home"}
              class="hidden bg-gradient-to-r from-primary to-primary bg-clip-text px-1 text-xl font-bold text-transparent transition-colors hover:from-primary/90 hover:to-primary/90 md:block"
            >
              Just hello
            </Link>
          </div>
          <div class="flex items-center gap-4">
            <Link
              href={"/profile"}
              class="hidden bg-gradient-to-r from-primary to-primary bg-clip-text px-1 text-xl font-bold text-transparent transition-colors hover:from-primary/90 hover:to-primary/90 md:block"
            >
              Profile
            </Link>
          </div>


        </nav>
      </header>
    )
  );
});
