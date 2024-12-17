import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import Landing from "./landing";
export default component$(() => {
  return <Landing />;
});
export const head: DocumentHead = {
  title: "Just RND",
  meta: [
    {
      name: "description",
      content: "some plaform about collaboration",
    },
  ],
};
