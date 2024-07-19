import type { RequestHandler } from "@builder.io/qwik-city";
import { component$, Slot } from "@builder.io/qwik";

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
    if (currentTime > sessionDate) {
      throw req.redirect(302, "/login");
    }
  }
  if (!data) {
    throw req.redirect(302, "/");
  }
};

//

export default component$(() => {
  return (
    <div class="">
      <Slot />
    </div>
  );
});
