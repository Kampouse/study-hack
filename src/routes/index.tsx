import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const Landing = component$(() => {
  return (
    <div class="bg-hero-bg   bg-center  px-32 md:h-[110vh] md:w-[68em] lg:h-[100vh]  lg:w-[80em]  lg:scale-110">
      <div class="flex h-full flex-col items-center justify-center">
        <h1 class="self-start text-5xl font-bold text-black md:ml-[3.5em] lg:ml-[5.5em]">
          Learn & Hack
        </h1>
        <p class="w-[22em] px-4   text-2xl text-black ">
          {" "}
          have you consider writing an os from scratch but think your too bad?
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
