import { component$, Slot } from "@qwik.dev/core";

export default component$(() => {
  return (
    <div class="">
      <Slot />
    </div>
  );
});
