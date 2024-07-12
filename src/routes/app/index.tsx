import { component$ } from "@builder.io/qwik";
import { useAuthSignout } from "../plugin@auth";
import { Form } from "@builder.io/qwik-city";
export default component$(() => {
  const signout = useAuthSignout();

  return (
    <div class=" bg-red-500 py-32">
      <Form action={signout}>
        <input
          class="py-32"
          type="hidden"
          name="redirectTo"
          value="/signedout"
        />
        <button class="text-black">Sign Out</button>
      </Form>

      <h1>Hello World</h1>
    </div>
  );
});
