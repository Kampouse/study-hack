import { useAuthSignin } from "../plugin@auth";
import { component$ } from "@builder.io/qwik";
import { GoogleIcon, GithubIcon } from "~/components/icons";
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
      throw req.redirect(302, "/home");
    }
  }
};

export default component$(() => {
  const signin = useAuthSignin();
  return (
    <div class="flex h-fit   flex-col items-center justify-around  gap-4  bg-white py-10 shadow-sm lg:pt-4">
      <img
        height={1000}
        width={1000}
        src="https://github.com/Kampouse/Kampouse/blob/main/media/login.png?raw=true"
        class=" order-last   h-72 w-96   lg:h-[22em] "
      />

      <div class="order-first flex  flex-col  gap-2 text-center lg:pt-10   ">
        <h1 class="text-4xl ">Get started</h1>
        <p class="text-lg text-[#757575]">Select a platform to login</p>
      </div>

      <div class="order-last flex flex-col items-center gap-4 pb-4">
        <Form action={signin}>
          <input type="hidden" name="providerId" value="github" />
          <input
            type="hidden"
            name="options.callbackUrl"
            value="/auth/signedin"
          />
          <button class="button button-auth flex items-center justify-center gap-2 rounded-lg bg-[#272c30] p-2">
            <GithubIcon />

            <span class="text-xl text-white">Continue with GitHub</span>
          </button>
        </Form>
        <Form action={signin}>
          <input type="hidden" name="providerId" value="github" />
          <input
            type="hidden"
            name="options.callbackUrl"
            value="/auth/signedin"
          />
          <button class="button button-auth flex items-center justify-center gap-2 rounded-lg bg-[#2494ec] p-2">
            <GoogleIcon />
            <span class="text-xl text-white">Continue with Google</span>
          </button>
        </Form>
      </div>
    </div>
  );
});
