import type { RequestHandler } from "@builder.io/qwik-city";
import type { useAuthSession } from "../plugin@auth";
import { component$, Slot } from "@builder.io/qwik";
type Session = ReturnType<typeof useAuthSession>;
export const onRequest: RequestHandler = (event) => {
  const session: Session = event.sharedMap.get("session");

  if (!session.value || new Date(session.value.expires) < new Date()) {
    throw event.redirect(302, `/`);
  }
};

export default component$(() => {
  return (
    <div class="">
      <Slot />
    </div>
  );
});
