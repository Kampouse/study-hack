import { component$ } from "@builder.io/qwik";
export default component$(() => {
  return (
    <header class="absolute h-fit w-full  ">
      <nav
        class="relative flex h-16 items-center justify-between  font-mono text-black shadow-sm"
        role="navigation"
      >
        <div class="pl-2 md:pl-8">
          <a href="#" class="text-2xl">
            {"S & H"}
          </a>
        </div>
        <div class="">
          <a href="#" class="p-4">
            Learn more
          </a>
          <a href="#" class="p-4">
            register
          </a>
          <a href="#" class="p-4">
            login
          </a>
        </div>
      </nav>
    </header>
  );
});
