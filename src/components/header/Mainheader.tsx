import { component$ } from "@builder.io/qwik";
import { useAuthSignin, useAuthSignout } from "~/routes/plugin@auth";
import { useAuthSession } from "~/routes/plugin@auth";
export default component$(() => {
  const session = useAuthSession();
  const signin = useAuthSignin();
  const signout = useAuthSignout();

  return (
    <header class="h-fit w-full px-4">
      <nav
        class="relative flex h-16 items-center justify-between  font-mono text-black shadow-sm"
        role="navigation"
      >
        <div class="pl-2 md:pl-8">
          <a href="#" class="text-2xl">
            {"S & H"}
          </a>
        </div>
        <div class="">
          <a href="#" class="p-4">
            Learn more
          </a>
          {!session.value && (
            <a href="#" class="p-4">
              register
            </a>
          )}

          {session.value && (
            <button onClick$={() => signout.submit({})}>Sign Out</button>
          )}
          {!session.value && (
            <button
              onClick$={() => {
                signin.submit({
                  providerId: "github",
                });
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
});
