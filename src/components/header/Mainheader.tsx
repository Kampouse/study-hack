import { component$ } from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";
import Dropdown from "../dropdown";
export default component$(() => {
  const session = useAuthSession();
  return (
    <header class="h-fit w-full px-4">
      <nav
        class="relative flex h-16 items-center justify-between  font-mono text-black shadow-sm"
        role="navigation"
      >
        <div class="pl-2 md:pl-8">
          <a href="/" class="text-2xl">
            {"S & H"}
          </a>
        </div>
        <div class="flex  flex-row content-center justify-center">
          {!session.value && (
            <a href="/" class="p-4">
              Learn more
            </a>
          )}

          {session.value && (
            <a href="/app/" class="content-center justify-center p-4">
              App
            </a>
          )}
          {session.value && (
            <a href="/profile" class="p-4">
              <Dropdown />
            </a>
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
