import { useAuthSignin } from "../plugin@auth";
import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
export const onGet: RequestHandler = async (req) => {
  type Session = {
    user: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
  } | null;
  const data = req.sharedMap.get("session") as Session;
  //get current session time and compare with expires time
  if (data) {
    const currentTime = new Date().getTime();
    const sessionDate = new Date(data.expires).getTime();
    if (currentTime < sessionDate) {
      throw req.redirect(302, "/app");
    }
  }
};

export default component$(() => {
  const signin = useAuthSignin();
  return (
    <div class=" bg-red-500 py-32">
      <Form action={signin}>
        <input type="hidden" name="providerId" value="github" />
        <input
          type="hidden"
          name="options.callbackUrl"
          value="/auth/signedin"
        />
        <button class="button button-auth"> sign in</button>
      </Form>
    </div>
  );
});
