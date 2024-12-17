import { component$ } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
export default component$(() => {
  const loc = useLocation();
  return <div> hi am {loc.params.name}</div>;
});
