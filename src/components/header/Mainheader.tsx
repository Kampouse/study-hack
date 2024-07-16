import { component$ } from "@builder.io/qwik";
import { useAuthSignout } from "~/routes/plugin@auth";
import { Form } from "@builder.io/qwik-city";
import { useAuthSession } from "~/routes/plugin@auth";
export default component$(() => {
  const session = useAuthSession();

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
        <div class="flex  flex-row justify-center content-center">
          <a href="#" class="p-4">
            Learn more
          </a>
          {session.value && (
            <Form action={signout} class="justify-center content-center">
              <input type="hidden" name="callbackUrl" value="/" />
              <button class="button button-signout">Sign Out</button>
            </Form>



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
