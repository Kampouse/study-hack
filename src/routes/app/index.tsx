import { component$ } from "@builder.io/qwik";
import Montreal from "~/components/leaflet-map/montreal";
const UserCards = component$(() => {
  return (
    <div class="px flex w-full content-center rounded-xl border  shadow-md  px-4 py-2  ">
      <div class="">
        <div class=" w-full flex flex-col">

          <div class="flex flex-row gap-4 h-20">
            <img height={75} width={75} class=" self-start" src="https://s6.imgcdn.dev/LyfCg.jpg" />
            <div class="flex flex-col self-center gap-1 ">
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
    <div class=" flex h-full flex-col justify-start  md:p-12  ">
      <div class="pb-8">
        <h1 class="text-3xl font-medium">Community</h1>
        <p class="text-md pb- py-1 font-thin  text-black">
          {" "}
          See who active this week
        </p>
      </div>
      <div class="flex grid-cols-5 flex-col gap-8 lg:grid">
        <div class="row-span-1 h-fit rounded-full  lg:col-span-3 ">

          <Montreal />
          <div class="w-full  bg-gray-100"></div>
        </div>
        <div class="row-span-1 rounded-xl    lg:col-span-2">
          <div class="flex h-full  flex-col justify-start py-1 gap-4">
            <UserCards />
            <UserCards />
            <UserCards />
          </div>

        </div>

      </div>

    </div>
  );
});
