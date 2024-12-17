import { component$, Slot } from "@qwik.dev/core";
import { useVisibleTask$ } from "@qwik.dev/core";
import posthog from "posthog-js";
export default component$(() => {
  //eslint-disable-next-line
  useVisibleTask$(() => {
    if (document.location.host.includes("study-hack.vercel.app")) {
      posthog.init("phc_4TyE0DMk3m3zjsaAxXOKlPZAGeqBuuGrVxfTDUQCK74", {
        api_host: "https://us.i.posthog.com",
        capture_heatmaps: true,
        capture_pageview: true,
        capture_performance: true,
        disable_external_dependency_loading: true, // Optional - will ensure we never try to load extensions lazily
      });
    }
  });

  return (
    <div class="px-3 pt-12 lg:px-8">
      <Slot />
    </div>
  );
});
