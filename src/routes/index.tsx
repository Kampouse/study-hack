import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const Landing = component$(() => {
  return (
    <div class="bg-hero-bg  h-[80vh]  bg-cover bg-center  px-16 pt-10  md:h-[110vh]  md:w-[68em] md:px-[25vw]  lg:h-screen   lg:w-[80em] ">
      <div class="flex h-full flex-col items-center justify-center md:gap-4">
        <h1 class="text-4xl md:text-5xl">Study & Hack</h1>
        <p class=" w-fit px-1 text-sm text-black md:text-2xl lg:px-5 ">
          {" "}
          Love coding, yet finding yourself isolated lately? Seek out and
          connect with a fellow programmer in Montreal to study with, share
          ideas and keep each other motivated on your quest through the cyber
          space.
        </p>
      </div>
    </div>
  );
});

export default component$(() => {
  return (
    <div>
      <Landing />
      <h1></h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "learn & hack",
  meta: [
    {
      name: "description",
      content: "some plaform about collaboration",
    },
  ],
};
