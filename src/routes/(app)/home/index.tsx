import { component$ } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import { EventCard } from "@/components/app/eventCard/EventCard";
import type { popupsData } from "~/models/map";
import { routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import { QueryEvents } from "~/api/Query";
export type Events = Awaited<ReturnType<typeof useEvents>>;
export const head = {
  title: " S&H | Home",
};
export const useEventAction = routeAction$((e) => {
  console.log("hello from event action", e);

  return {
    success: true,
  };
});
export type EventAction = ReturnType<typeof useEventAction>;

export const useEvents = routeLoader$(async (event) => {
  const data = await QueryEvents({ event: event, options: { limit: 6 } });

  return data;
});

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
  const events = useEvents();
  const coords = useMapData();
  const intrests = ["plant", "code", "working"];
  const location = ["montreal", "toronto", "vancouver"];

  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class="  py-2  md:px-2   ">
        <h1 class="px-2  text-3xl font-medium md:px-0 ">Community</h1>
        <p class="text-md    px-2 font-thin text-black  md:px-0">
          {" "}
          See who active this week
        </p>
      </div>
      <div class="flex grid-cols-5 flex-col gap-5 md:gap-2 lg:grid">
        <div class="row-span-1 h-fit rounded-full px-2 lg:col-span-3   lg:pl-2 ">
          <Leaflet popups={coords} />
          <div class="  pb-2 pt-4 ">
            <h1 class=" text-2xl font-medium "> Intrests Filters</h1>
          </div>
          <div class=" flex gap-2  md:px-0">
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

        <div class="row-span-1 rounded-xl lg:col-span-2">
          <div class="grid gap-2 px-2 md:grid-cols-2 lg:grid-cols-2 lg:gap-2">
            {events.value?.map((ev) => (
              <EventCard
                key={ev.eventID}
                title={ev.name}
                description={ev.description}
                time={ev.date}
                attendees={0}
                tags={[]}
              />
            ))}
          </div>
        </div>
      </div>
      <div class=" order-last px-2 pt-2">
        <h1 class="  pb-2 text-2xl  font-medium ">Good locations</h1>
        <div class=" flex  w-full flex-col content-center gap-2  md:flex-row lg:gap-4 ">
          {location.map((location) => (
            <div
              key={location}
              class="flex flex-col   gap-2 bg-gray-100 bg-opacity-30  md:w-[25em]  "
            >
              <div class="flex w-fit flex-col justify-center  gap-2 rounded-lg   border p-0    align-middle md:w-full">
                <img
                  src="https://s3.ca-central-1.amazonaws.com/files.quartierdesspectacles.com/lieux/esplanade-tranquille/2022/printemps/esplanade-tranquille-pqds-2022-esplanade-tranquille-printemps-ete-c-vivien-gaumand-20-390x260.jpg"
                  alt="location"
                  width={400}
                  height={100}
                  class="rounded-md rounded-b-none  "
                />
                <div class="gap-2  ">
                  <div class="px-2 pb-2">
                    <p class="text-md  pb-1  font-thin text-black  ">
                      <span class="font-medium"> {location} </span> open 24/7
                    </p>
                    <p class=" text-md font-thin  text-black ">
                      a cozy spot where people dont bother your for coffee{" "}
                    </p>
                  </div>
                  <button class=" max-w-lg cursor-pointer self-start rounded-md   bg-gray-50   p-3 text-black  shadow-md ">
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
