import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const Landing = component$(() => {
  return (
    <div class="bg-hero-bg  h-[80vh]  bg-cover bg-center  px-[25vw] pt-10    md:h-[110vh] md:w-[68em]  lg:h-screen   lg:w-[80em] ">
      <div class="flex h-full flex-col items-center justify-center">
        <h1 class="text-5xl">Learn & Hack</h1>
        <p class=" w-[12em] text-lg text-black md:w-[17em] md:text-2xl lg:px-5 ">
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
