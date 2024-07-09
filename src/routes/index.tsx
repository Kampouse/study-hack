import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const Landing = component$(() => {
  return (
    <div class="bg-hero-bg     flex items-center flex-col justify-center py-40   bg-cover h-[34em] bg-center  px-16    md:h-[110vh]  md:w-[68em] lg:px-96 md:px-60  lg:h-screen   lg:w-[80em]  ">
      <h1 class="text-3xl md:hidden pb-8    ">Study & Hack</h1>
      <div class=" flex h-full flex-col px-2   lg:pl-10 lg:pt-12  md:mt-10 lg:items-start md:items-center md:pt-8 justify-center gap-2  md:gap-4">
        <h1 class=" hidden md:flex   md:text-5xl    ">Study & Hack</h1>
        <p class=" max-w-[15em] md:max-w-[25em]  w-fit pl-4 px-2 text-md self-start font-medium   bg-opacity-30 rounded-xl  text-black  md:text-2xl md:px-24 lg:px-0  ">
          Feeling isolated while working? Connect with a fellow techies in Montreal to study, share ideas, and stay motivated on your cyber journey.
        </p>
        <div class=" flex  md:flex-row gap-4       md:self-start  md:pl-24 lg:pl-0 px-2 md:px-0   ">
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


const UserReview = component$(() => {
  return (<div class="flex w-full  flex-col lg:pl-8 justify-center pt-8">
    <ul class="flex flex-col list-disc   text-blue-200  md:w-[60em] pt-8 pb-4   p-16 pr-2 pl-12 md:ml-48 rounded-b-none md:px-8 md:pb-0 lg:pb-8 gap-6 bg-[#e4eff7] border-gray-100   rounded-3xl">
      <h1 class="w-full text-5xl  pb-1 text-black   "> Use S&H Because{"<T>"}...  </h1 >
      <li class="w-full  text-2xl text-blue-500  font-light">
        <span class="text-black">
          I am unabe to commit without others   ....  now i can git push
        </span>
      </li  >
      <li class="w-full  text-2xl text-blue-500  font-light">
        <span class="text-black">
          I can't stick to one project alone ...  I always get feedback
        </span>
      </li  >
      <li class="w-full  text-2xl text-blue-500  font-light">
        <span class="text-black">
          Am just lonely! ...  Found a friend with common interest
        </span>
      </li  >
    </ul>
  </div>
  );
});

const Method = component$(() => {
  return (
    <div class=" flex w-full  flex-col lg:pl-8 justify-center  lg:pt-0">
      <ul class=" flex flex-col list-decimal    md:w-[60em]   p-12 pb-4 pt-4 md:pt-8 lg:pt-2 pr-2 pl-12 md:ml-48   md:px-8 gap-6 bg-[#e4eff7] border-gray-100 rounded-t-none   rounded-3xl">

        <h1 class="w-full text-5xl  pb-1 text-black   ">So how does it work?</h1 >
        <li class=" flex w-fit   flex-col  text-2xl text-blue-500   font-light">
          <span class="text-black">
            Let us know when you free
          </span>
          <div class="flex  flex-row gap">
            <select disabled={true} class="bg-blue-200 hover:bg-blue-400 mt-2  text-gray-800  font-bold rounded-lg rounded-r-none pl-6  w-36  " >
              <option>Monday</option>
            </select >
            <select disabled={true} class=" bg-blue-200 hover:bg-blue-300   mt-2 text-gray-800 font-bold rounded-lg rounded-l-none pl-6  w-36  " >
              <option>Morning </option>
            </select >
          </div >
        </li >
        <li class=" flex w-fit  flex-col  text-2xl text-blue-500   font-light">
          <span class="text-black">
            what you will be working on:
          </span>
          <textarea readOnly={true} class="bg-blue-200 hover:bg-blue-100 border-blue-200  mt-2 text-gray-800 font-light rounded-lg  pl-6  w-fit placeholder:text-gray-600 focus:placeholder:text-blue-800    " placeholder="Project" />
        </li >
        <li class="flex w-fit  flex-col  text-2xl text-blue-500 justify-start   font-light">
          <span class="text-black">
            where you will be working from:
          </span >
          <input readOnly={true} class="bg-blue-200 hover:bg-blue-100 border-blue-200  mt-2 text-gray-800 font-light rounded-lg  pl-6  w-fit placeholder:text-gray-600 focus:placeholder:text-blue-800    " type="text" placeholder="Location" />
          <button class="self-start text-black bg-blue-500 px-4 rounded-md mt-3">
            register :D
          </button>

        </li >


      </ul>


    </div  >

  );
});

export default component$(() => {
  return (
    <div class="">
      <Landing />
      <UserReview />
      <Method />
    </div >

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
