import { component$ } from "@qwik.dev/core";
import { Form } from "@qwik.dev/router";
import { Dropdown } from "@qwik-ui/headless";
import { Link } from "@qwik.dev/router";
export default component$(() => {
  const img = "https://s6.imgcdn.dev/LyfCg.jpg";
  const actions = [
    { label: "Profile", disabled: false, path: "/profile" },
    { label: "Setting", disabled: false, path: "/setting" },
    { label: "Home Page", disabled: false, path: "/landing" },
  ];
  return (
    <Dropdown.Root class="pr-12">

    </Dropdown.Root>
  );
});
