import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Desktop from "../assets/computer.png?jsx";
import Book from "../assets/book.png?jsx";

export default component$(() => {
  return (
    <main class="grid grid-cols-6 grid-rows-2 gap-4">
      <div class="row-span-3">
        {" "}
        <h1 class="p-4 text-5xl leading-[3.5rem]">
          {" "}
          Study <span class="font-medium text-green-200"> {">_"} </span> {"&&"}{" "}
          <br /> <span class="underline">hack </span>
        </h1>{" "}
        <Book class="ml-8 mt-4" />
      </div>
      <div class="col-span-2 row-span-3 gap-6">
        <h1 class="space-x-0 px-3 pt-16 text-2xl font-extralight">
          Love coding, yet finding yourself isolated lately? Seek out and
          connect with a fellow programmer in Montreal to study with, share
          ideas and keep each other motivated on your quest through the cyber
          space.
        </h1>
        <div class="ml-2  flex flex-row gap-6">
          <button class="mt-6 rounded-md bg-green-500 px-4 py-2 text-white">
            Get Started
          </button>
          <button class="mt-6 rounded-md bg-green-500 px-4 py-2 text-white">
            Learn More ...
          </button>
        </div>
        <h1> but this work </h1>
      </div>

      <div class="col-span-3 col-start-4 row-span-3">
        <Desktop class="h-[450px] w-[640px]" />
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
