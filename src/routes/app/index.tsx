import { component$ } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import { UserCards } from "@/components/cards";

export default component$(() => {
  const intrests = ["plant", "code", "working"];
  const location = ["montreal", "toronto", "vancouver"];

  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class=" px-2 py-2  md:px-6 md:py-4  ">
        <h1 class="text-3xl font-medium ">Community</h1>
        <p class="text-md   font-thin  text-black"> See who active this week</p>
      </div>
      <div class="flex grid-cols-5 flex-col gap-2 md:gap-2 lg:grid">
        <div class="row-span-1 h-fit rounded-full  lg:col-span-3  lg:pl-4 ">
          <Leaflet />
          <div class=" px-2 pt-2 ">
            <h1 class="py-2 text-2xl font-medium "> Intrests Filters</h1>
            <div class=" flex gap-2 ">
              {intrests.map((intrest) => (
                <button
                  key={intrest}
                  class=" max-w-lg self-end rounded-md border bg-blue-50 p-2  text-black shadow-sm  "
                >
                  {intrest}
                </button>
              ))}
            </div>
          </div>
          <div class=" px-2 pt-2 ">
            <h1 class="py-2 text-2xl font-medium ">Good locations</h1>
            <div class=" flex gap-2 ">
              {location.map((location) => (
                <button
                  key={location}
                  class=" max-w-lg self-end rounded-md border bg-blue-50 p-2  text-black shadow-sm  "
                >
                  {location}
                </button>
              ))}
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
