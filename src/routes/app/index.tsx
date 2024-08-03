import { component$ } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import { UserCards } from "@/components/cards";
import type { popupsData } from "~/models/map";
import { routeLoader$ } from "@builder.io/qwik-city";
export const useMapData = routeLoader$(async () => {
  const coords: popupsData = [
    {
      name: "place  central",
      coords: [45.5017, -73.5673],
    },
    {
      name: "place demi",
      coords: [45.5017, -72.5673],
    },
  ];
  return coords;
});

export default component$(() => {
  const coords = useMapData();

  const intrests = ["plant", "code", "working"];
  const location = ["montreal", "toronto", "vancouver"];

  const card = {
    name: "Kampi",
    description: "studying for cs-231",
    time: "1pm - 4pm",
    tags: ["python", "javascript", "study"],
  };
  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class=" px-2 py-2  md:px-6 md:py-4  ">
        <h1 class="text-3xl font-medium ">Community</h1>
        <p class="text-md   font-thin  text-black"> See who active this week</p>
      </div>
      <div class="flex grid-cols-5 flex-col gap-5 md:gap-2 lg:grid">
        <div class="row-span-1 h-fit rounded-full  lg:col-span-3  lg:pl-4 ">
          <Leaflet popups={coords} />
          <div class=" px-2 pb-4 pt-4 ">
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
        </div>
        <div class="row-span-1 rounded-xl    lg:col-span-2 ">
          <div class="flex h-full  flex-col justify-start gap-4 px-2 py-1">
            <UserCards user={card} />
            <UserCards />
            <UserCards />
          </div>
        </div>
      </div>
      <div class=" order-last px-2 pl-4 pt-2 ">
        <h1 class=" pb-4 text-2xl font-medium ">Good locations</h1>
        <div class=" flex  w-full flex-col content-center gap-8  md:flex-row lg:gap-10 ">
          {location.map((location) => (
            <div
              key={location}
              class="flex flex-col   gap-2 bg-gray-100 bg-opacity-30  md:w-[25em]  "
            >
              <div class="flex w-fit flex-col justify-center  gap-2 rounded-lg   border p-0   pb-2 align-middle md:w-full">
                <img
                  src="https://s3.ca-central-1.amazonaws.com/files.quartierdesspectacles.com/lieux/esplanade-tranquille/2022/printemps/esplanade-tranquille-pqds-2022-esplanade-tranquille-printemps-ete-c-vivien-gaumand-20-390x260.jpg"
                  alt="location"
                  width={400}
                  height={100}
                  class="rounded-md rounded-b-none shadow-xl "
                />
                <div class="gap-2 px-2">
                  <p class="text-md  pb-1  font-thin text-black  ">
                    <span class="font-medium"> {location} </span> open 24/7
                  </p>
                  <p class=" text-md font-thin  text-black ">
                    a cozy spot where people dont bother your for coffee{" "}
                  </p>
                  <button class=" max-w-lg cursor-pointer self-start rounded-md border  bg-gray-50 p-2  text-black shadow-sm  ">
                    book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
