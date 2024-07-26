import { component$ } from "@builder.io/qwik";
import Montreal from "~/components/leaflet-map/montreal";
const UserCards = component$(() => {
  return (
    <div class="px flex w-full content-center rounded-xl border  shadow-md  px-4 py-2 md:p-8 md:pb-0 ">
      <div class="">
        <div class=" w-full flex flex-col">

          <div class="flex flex-row gap-4 h-20">
            <img height={75} width={75} class=" self-start" src="https://s6.imgcdn.dev/LyfCg.jpg" />
            <div class="flex flex-col self-center gap-1  ">
              <h1 class="font-bold self-start">@Kampouse</h1>
              <h1 class="font-semibol  self-start">studying for cs-231 </h1>
              <h1 class="font-light  self-start">1pm - 4pm</h1>

            </div>
          </div>





          <div class="flex flex-row gap-2  justify-start   pt-4 ">

            <button class="bg-green-400 text-black rounded-md self-end  max-w-lg p-2  ">Join me</button>
            <h1 class="border rounded-lg p-2">  python </h1>
            <h1 class="border rounded-lg p-2">  python </h1>
            <h1 class="border rounded-lg p-2">  python </h1>


          </div>


          <div class="flex flex-row gap-2  justify-end py-2 ">
          </div>

        </div>


      </div>

    </div>
  );
});

export default component$(() => {
  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class=" px-6  py-2 md:py-4  ">
        <h1 class="text-3xl font-medium ">Community</h1>
        <p class="text-md   font-thin  text-black">
          {" "}
          See who active this week
        </p>
      </div>
      <div class="flex grid-cols-5 flex-col gap-2 md:gap-2 lg:grid">
        <div class="row-span-1 h-fit rounded-full  lg:col-span-3  lg:pl-4 ">

          <Montreal />

          <div class=" pt-2 px-2 ">
            <h1 class="text-2xl font-medium py-2 "> Intrests Filters</h1>
            <div class=" flex gap-2 ">
              <button class="bg-blue-50 shadow-sm border text-black rounded-md self-end  max-w-lg p-2  ">  plant </button>
              <button class="bg-blue-50 shadow-sm  border text-black rounded-md self-end  max-w-lg p-2  ">  code  </button>
              <button class="bg-blue-50  shadow-sm border text-black rounded-md self-end  max-w-lg p-2  ">  working </button>
            </div>
          </div>
        </div>
        <div class="row-span-1 rounded-xl    lg:col-span-2 ">
          <div class="flex h-full  flex-col justify-start py-1 px-2 gap-4">
            <UserCards />
            <UserCards />
            <UserCards />
          </div>

        </div>
      </div>

    </div>
  );
});
