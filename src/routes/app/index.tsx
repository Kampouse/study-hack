import { component$ } from "@builder.io/qwik";
import Montreal from "~/components/leaflet-map/montreal";
const UserCards = component$(() => {
  return (
    <div class="px flex w-full content-center rounded-xl border  px-4  py-2 shadow-md md:p-8 md:pb-0 ">
      <div class="">
        <div class=" flex w-full flex-col">
          <div class="flex h-20 flex-row gap-4">
            <img
              height={75}
              width={75}
              class=" self-start"
              src="https://s6.imgcdn.dev/LyfCg.jpg"
            />
            <div class="flex flex-col gap-1 self-center  ">
              <h1 class="self-start font-bold">@Kampouse</h1>
              <h1 class="font-semibol  self-start">studying for cs-231 </h1>
              <h1 class="self-start  font-light">1pm - 4pm</h1>
            </div>
          </div>

          <div class="flex flex-row justify-start  gap-2   pt-4 ">
            <button class="max-w-lg self-end rounded-md bg-green-400  p-2 text-black  ">
              Join me
            </button>
            <h1 class="rounded-lg border p-2"> python </h1>
            <h1 class="rounded-lg border p-2"> python </h1>
            <h1 class="rounded-lg border p-2"> python </h1>
          </div>

          <div class="flex flex-row justify-end  gap-2 py-2 "></div>
        </div>
      </div>
    </div>
  );
});

export default component$(() => {
  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class=" px-2 py-2  md:px-6 md:py-4  ">
        <h1 class="text-3xl font-medium ">Community</h1>
        <p class="text-md   font-thin  text-black"> See who active this week</p>
      </div>
      <div class="flex grid-cols-5 flex-col gap-2 md:gap-2 lg:grid">
        <div class="row-span-1 h-fit rounded-full  lg:col-span-3  lg:pl-4 ">
          <Montreal />

          <div class=" px-2 pt-2 ">
            <h1 class="py-2 text-2xl font-medium "> Intrests Filters</h1>
            <div class=" flex gap-2 ">
              <button class="max-w-lg self-end rounded-md border bg-blue-50 p-2  text-black shadow-sm  ">
                {" "}
                plant{" "}
              </button>
              <button class="max-w-lg self-end  rounded-md border bg-blue-50 p-2  text-black shadow-sm  ">
                {" "}
                code{" "}
              </button>
              <button class="max-w-lg  self-end rounded-md border bg-blue-50 p-2  text-black shadow-sm  ">
                {" "}
                working{" "}
              </button>
            </div>
          </div>
        </div>
        <div class="row-span-1 rounded-xl    lg:col-span-2 ">
          <div class="flex h-full  flex-col justify-start gap-4 px-2 py-1">
            <UserCards />
            <UserCards />
            <UserCards />
          </div>
        </div>
      </div>
    </div>
  );
});
