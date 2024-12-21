import { useSignIn } from "../plugin@auth";
import { component$ } from "@builder.io/qwik";
import { GoogleIcon, GithubIcon } from "~/components/icons";
import { Form } from "@builder.io/qwik-city";
import JustRnd from "./justrnd.png?jsx";
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
  const signin = useSignIn();
  return (
    <div class="flex h-fit   flex-col items-center justify-around    bg-white py-10 shadow-sm lg:pt-4">
      <JustRnd class="h-72 w-72" />

      <div class="order-last mx-auto flex w-full max-w-md flex-col items-center justify-center gap-6 p-8">
        <Form action={signin} class="w-full">
          <input type="hidden" name="providerId" value="github" />
          <input
            type="hidden"
            name="options.callbackUrl"
            value="/auth/signedin"
          />
          <button class="button button-auth flex w-full transform items-center justify-center gap-3 rounded-xl bg-[#272c30] px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <GithubIcon />
            <span class="text-lg font-medium text-white md:text-xl">
              Continue with GitHub
            </span>
          </button>
        </Form>

        <Form action={signin} class="w-full">
          <input type="hidden" name="providerId" value="github" />
          <input
            type="hidden"
            name="options.callbackUrl"
            value="/auth/signedin"
          />
          <button class="button button-auth flex w-full transform items-center justify-center gap-3 rounded-xl bg-[#2494ec] px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <GoogleIcon />
            <span class="text-lg font-medium text-white md:text-xl">
              Continue with Google
            </span>
          </button>
        </Form>
      </div>
    </div>
  );
});
