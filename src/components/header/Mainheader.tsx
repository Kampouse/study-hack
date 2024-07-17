import { component$ } from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";
import { Link } from "@builder.io/qwik-city";
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
          <Link href={session.value ? "/app" : "/"} class=" p-4 text-2xl">
            {"S & H"}
          </Link>
        </div>
        <div class="flex  flex-row content-center justify-center">
          {!session.value && (
            <Link href="/" class="p-4">
              Learn more
            </Link>
          )}

          {session.value && <Dropdown />}

          {!session.value && (
            <Link href="/login" class="p-4">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
});
