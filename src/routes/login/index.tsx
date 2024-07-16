import { useAuthSignin } from "../plugin@auth";
import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

export default component$(() => {
  const signin = useAuthSignin();
  return (
    <div class=" bg-red-500 py-32">
      <Form action={signin}>
        <input type="hidden" name="providerId" value="github" />
        <input type="hidden" name="options.callbackUrl" value="/auth/signedin" />
        <button class="button button-auth"> sign in</button>
      </Form>
    </div>
  );
});
