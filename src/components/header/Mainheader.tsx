import { component$ } from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";
import Dropdown from "@/components/dropdown"
export default component$(() => {
  const session = useAuthSession();
  return (
    <header class="h-fit w-full ">
      <nav
        class="relative flex h-16 items-center justify-between  font-mono text-black shadow-sm"
        role="navigation"
      >
        <div class="pl-2 md:pl-8">
          <a href={session.value ? "/app" : "/"} class=" p-4 text-2xl">
            {"S & H"}
          </a>
        </div>
        <div class="flex  flex-row content-center justify-center">
          {!session.value && (
            <a href="/" class="p-4">
              Learn more
            </a>
          )}

          {session.value && <Dropdown />}

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
