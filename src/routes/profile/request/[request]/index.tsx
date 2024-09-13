import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
export default component$(() => {
  const location = useLocation();
  return (
    <div>
      am the requests thing with: {location.params.request}
      <button class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Click me
      </button>
    </div>
  );
});
