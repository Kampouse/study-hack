import { component$ } from "@builder.io/qwik";
import Montreal from "~/components/leaflet-map/montreal";
const UserCards = component$(() => {
  return (
    <div class="px flex w-full content-center rounded-xl  bg-red-50 px-8 py-8  ">
      <div class="flex flex-row gap-5">
        <img height={60} width={60} src="https://s6.imgcdn.dev/LyfCg.jpg" />
        <div>
          <h1 class="font-medium">@Kampouse</h1>
          <h1 class="font-normal">studying because i can</h1>
          <h1 class="font-extralight">1pm - 2pm - Banq (the library)</h1>
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
      <div class="flex grid-cols-5 flex-col gap-8 md:grid">
        <div class="row-span-1 h-[35em] rounded-xl bg-gray-200 p-4 md:col-span-3 ">
          <Montreal />

          <div class="w-full  bg-gray-100"></div>
        </div>
        <div class="row-span-1 rounded-xl bg-red-100 p-4 shadow-sm md:col-span-2">
          <div class="flex h-full  flex-col justify-evenly gap-1">
            <UserCards />
            <UserCards />
            <UserCards />
          </div>
        </div>
      </div>
    </div>
  );
});
