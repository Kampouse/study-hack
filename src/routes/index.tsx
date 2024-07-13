import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuthSession } from "./plugin@auth";
const Landing = component$(() => {
  return (
    <div class="flex     h-[34em] flex-col items-center justify-center bg-hero-bg   bg-cover bg-center px-16  py-40    md:h-[110vh]  md:w-[68em] md:px-60 lg:h-screen  lg:w-[80em]   lg:px-96  ">
      <h1 class="pb-8 text-3xl md:hidden    ">Study & Hack</h1>
      <div class=" flex h-full flex-col justify-center   gap-2 px-2  md:mt-10 md:items-center md:gap-4 md:pt-8 lg:items-start lg:pl-10  lg:pt-12">
        <h1 class=" hidden md:flex   md:text-5xl    ">Study & Hack</h1>
        <p class=" text-md w-fit  max-w-[15em] self-start rounded-xl bg-opacity-30 px-2 pl-4   font-medium text-black  md:max-w-[25em]  md:px-24 md:text-2xl lg:px-0  ">
          Feeling isolated while working? Connect with a fellow techies in
          Montreal to study, share ideas, and stay motivated on your cyber
          journey.
        </p>
        <div class=" flex  gap-4 px-2       md:flex-row  md:self-start md:px-0 md:pl-24 lg:pl-0   ">
          <button class="rounded-lg bg-blue-500 p-1 font-bold text-white  transition duration-100 ease-in-out hover:bg-blue-700  md:p-2">
            Get Started
          </button>
          <button class="rounded-lg bg-blue-500  p-1 font-bold text-white transition duration-100 ease-in-out  hover:bg-blue-700 md:p-2">
            learn more
          </button>
        </div>
      </div>
    </div>
  );
});

const UserReview = component$(() => {
  return (
    <div class="flex w-full  flex-col justify-center pt-8 lg:pl-8">
      <ul class="flex list-disc flex-col   gap-6  rounded-3xl rounded-b-none border-gray-100   bg-[#e4eff7] p-16 pb-4 pl-12 pr-2 pt-8 text-blue-200 md:ml-48 md:w-[60em] md:px-8 md:pb-0   lg:pb-8">
        <h1 class="w-full pb-1  text-5xl text-black   ">
          {" "}
          Use S&H Because{"<T>"}...{" "}
        </h1>
        <li class="w-full  text-2xl font-light  text-blue-500">
          <span class="text-black">
            I am unabe to commit without others .... now i can git push
          </span>
        </li>
        <li class="w-full  text-2xl font-light  text-blue-500">
          <span class="text-black">
            I can't stick to one project alone ... I always get feedback
          </span>
        </li>
        <li class="w-full  text-2xl font-light  text-blue-500">
          <span class="text-black">
            Am just lonely! ... Found a friend with common interest
          </span>
        </li>
      </ul>
      <ul class=" flex list-disc flex-col   gap-6  rounded-3xl rounded-t-none border-gray-100   bg-[#e4eff7] p-16 pb-4 pl-12 pr-2 pt-8 text-blue-200 md:ml-48 md:w-[60em] md:px-8 md:pb-0   lg:pb-8">
        <h1 class="w-full pb-1  text-5xl text-black   ">
          So how does it work?
        </h1>
        <li class=" flex w-fit   flex-col  text-2xl font-light   text-blue-500">
          <span class="text-black">Let us know when you free</span>
          <div class="gap  flex flex-row">
            <select
              disabled={true}
              class="mt-2 w-36 rounded-lg rounded-r-none bg-blue-200 p-2 pl-6  font-light  text-gray-800 transition duration-500 ease-in-out  hover:bg-blue-100  "
            >
              <option>Monday</option>
            </select>
            <select
              disabled={true}
              class=" mt-2 w-36 rounded-lg rounded-l-none bg-blue-200 p-2   pl-6 font-light text-gray-800 transition duration-500 ease-in-out  hover:bg-blue-100  "
            >
              <option>Morning </option>
            </select>
          </div>
        </li>
        <li class=" flex w-fit  flex-col  text-2xl font-light   text-blue-500">
          <span class="text-black">what you will be working on:</span>
          <textarea
            readOnly={true}
            class="mt-2 w-fit rounded-lg  border-blue-200 bg-blue-200 pl-6 font-light text-gray-800 transition duration-500  ease-out  placeholder:text-gray-600 hover:bg-blue-100 focus:placeholder:text-blue-800    "
            placeholder="Project..."
          />
        </li>
        <li class="flex w-fit  flex-col  justify-start text-2xl font-light    text-blue-500">
          <span class="pb-2 text-black">where you will be working from:</span>
          <input
            readOnly={true}
            class="w-32 rounded-lg bg-blue-200 p-4 transition duration-500 ease-out placeholder:text-gray-600 hover:bg-blue-100"
            type="text"
            placeholder="Location..."
          />
          <button class="mt-3 w-fit rounded-lg bg-blue-500 p-1 font-light text-white transition duration-150 ease-in-out  hover:bg-blue-700 md:p-2">
            Get Started
          </button>
        </li>
      </ul>
    </div>
  );
});

const UserStory = component$(() => {
  return (
    <div class="mt-10 w-fit rounded-3xl bg-[#e0efe6] px-2 py-6 pr-14  md:ml-52 lg:ml-56">
      <div class=" w-fit max-w-4xl  ">
        <h1 class="w-full px-4  pb-1 text-left text-5xl text-black">
          {" "}
          Review from a user{" "}
        </h1>
        <div class="flex flex-row justify-evenly  gap-4 p-4  text-black md:justify-start ">
          <div class="flex flex-col gap-6 pt-6 lg:flex-row lg:gap-32 ">
            <div class="self-left flex flex-col gap-2">
              <img
                class="h-16 w-16 self-center rounded-full"
                width={300}
                height={300}
                src="https://randomuser.me/api/portraits/women/20.jpg"
              />

              <h1 class="text-center text-2xl font-bold ">Johny</h1>
              <h2 class="text-center text-lg font-light">Software Developer</h2>

              <h3 class="text-center  text-lg font-medium">
                I been able to contribute to a oss that i did not even know
                existed!
              </h3>
            </div>
            <div class="self-left flex flex-col gap-2">
              <img
                class="h-16 w-16 self-center rounded-full"
                width={300}
                height={300}
                src="https://randomuser.me/api/portraits/women/20.jpg"
              />

              <h1 class="text-center text-2xl font-bold ">Eric</h1>
              <h2 class="text-center text-lg font-light">Software Developer</h2>
              <h3 class="text-center  text-lg font-medium">
                I been able to contribute to a oss that i did not even know
                existed!
              </h3>
            </div>
            <div class="self-left flex flex-col gap-2">
              <img
                class="h-16 w-16 self-center rounded-full"
                width={300}
                height={300}
                src="https://randomuser.me/api/portraits/women/20.jpg"
              />

              <h1 class="text-center text-2xl font-bold ">Janny</h1>
              <h2 class="text-center text-lg font-light">Software Developer</h2>

              <h3 class="text-center  text-lg font-medium">
                I been able to contribute to a oss that i did not even know
                existed!
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const authMain = component$(() => {
  // const session = useAuthSession();

  return (
    <div class="bg-red-gray-200">
      <h1> am login </h1>
    </div>
  );
});

export default component$(() => {
  const session = useAuthSession();
  return (
    <div class="bg-red-gray-200">
      {session.value && <div> am log in </div>}
      {!session.value && (
        <div>
          <Landing />
          <UserReview />
          <UserStory />
        </div>
      )}
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
