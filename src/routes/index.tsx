import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const Landing = component$(() => {
  return (
    <div class="bg-hero-bg     flex items-center flex-col justify-center py-40   bg-cover h-[80vh] bg-center  px-16    md:h-[110vh]  md:w-[68em] md:px-[25vw]  lg:h-screen   lg:w-[80em] ">


      <h1 class="text-3xl md:hidden pb-10    ">Study & Hack</h1>
      <div class="flex h-full flex-col   lg:pl-10 lg:pt-16  md:mt-10 lg:items-start md:items-center md:pt-8 justify-center gap-2  md:gap-4">
        <h1 class=" hidden md:flex   md:text-5xl    ">Study & Hack</h1>
        <p class=" w-fit px-2 text-md self-start font-medium   bg-opacity-30 rounded-xl  text-black  md:text-2xl md:px-24 lg:px-0  ">
          Feeling isolated while working? Connect with a fellow techies in Montreal to study, share ideas, and stay motivated on your cyber journey.
        </p>
        <div class=" flex  md:flex-row gap-4      md:self-start  md:pl-24 lg:pl-0 px-2 md:px-0   ">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 md:p-2  rounded-lg">
            Get Started
          </button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1  md:p-2 rounded-lg">
            learn more
          </button>
        </div >
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
