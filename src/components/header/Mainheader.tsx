import { component$ } from "@builder.io/qwik";
export default component$(() => {
  return (
    <header class="absolute h-fit w-full  ">
      <nav class="flex flex-row justify-end  gap-16  py-4 pr-16 lg:w-screen ">
        <a href="/">how it works</a>
        <a href="/about">sign up</a>
        <a href="/user">Login</a>
      </nav>
    </header>
  );
});
