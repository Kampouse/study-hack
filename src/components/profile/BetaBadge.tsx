import { component$ } from "@builder.io/qwik";

export const BetaBadge = component$(() => {
  return (
    <span class="ml-2 inline-flex items-center rounded-md bg-[#FFF1E6] px-2 py-0.5 text-xs font-semibold text-[#C27B62] ring-1 ring-inset ring-[#F8D7BD]">
      Beta
    </span>
  );
});
