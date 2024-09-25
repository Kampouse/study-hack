import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
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
