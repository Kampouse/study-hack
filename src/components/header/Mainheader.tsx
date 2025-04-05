import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <header class="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <nav class="container mx-auto flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <Link
            href={"/home"}
            class="bg-gradient-to-r from-primary to-primary bg-clip-text text-xl font-bold text-transparent transition-colors hover:from-primary/90 hover:to-primary/90"
          >
            Just hello
          </Link>
        </div>

        <div class="hidden md:flex items-center gap-4">
          <Link
            href={"/profile"}
            class="bg-gradient-to-r from-primary to-primary bg-clip-text px-1 text-xl font-bold text-transparent transition-colors hover:from-primary/90 hover:to-primary/90"
          >
            Profile
          </Link>
        </div>

        <div class="md:hidden">
          <button
            onClick$={() => isOpen.value = !isOpen.value}
            class="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Toggle navigation menu"
          >
            <svg
              class="h-6 w-6 fill-current text-gray-700 dark:text-gray-200"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen.value ? (
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              ) : (
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>
      <div
        class={`md:hidden ${isOpen.value ? "block" : "hidden"
          } border-t border-border/40 bg-background/95 backdrop-blur-sm`}
      >
        <div class="flex flex-col items-center py-4 gap-4">
          <Link
            href={"/profile"}
            class="block bg-gradient-to-r from-primary to-primary bg-clip-text px-1 text-xl font-bold text-transparent transition-colors hover:from-primary/90 hover:to-primary/90"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
});
