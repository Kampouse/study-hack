import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
export default component$(() => {
  const loc = useLocation();
  return <div> hi am {loc.params.name}</div>;
});
