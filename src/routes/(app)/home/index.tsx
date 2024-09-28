import { component$ } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import {
  EventCard,
  EmptyEventCard,
} from "@/components/app/eventCard/EventCard";
import type { popupsData } from "~/models/map";
import { routeLoader$, routeAction$, Link } from "@builder.io/qwik-city";
import { QueryEvents } from "~/api/Query";
import { LocationCard } from "@/components/app/LocationCard/LocationCard";
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

const NewLocation = component$(() => {
  return (
    <Link
      href="/new/place"
      class="flex h-full min-h-[279px] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-600 transition-all duration-300 hover:scale-105 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
    >
      <div class="text-center">
        <svg
          class="mx-auto h-12 w-12 transition-transform duration-300 hover:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        <span class="mt-2 block text-sm font-medium transition-colors duration-300 hover:text-gray-800">
          Add a new location
        </span>
      </div>
    </Link>
  );
});

export default component$(() => {
  const events = useEvents();
  const coords = useMapData();

  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class="  py-2  md:px-2   ">
        <h1 class="px-2  text-3xl font-medium md:px-0 ">Community</h1>
        <p class="text-md    px-2 font-thin text-black  md:px-0">
          {" "}
          See who active this week
        </p>
      </div>
      <div class="flex flex-col gap-5 md:gap-2 lg:grid lg:grid-cols-5">
        <div class="order-2 row-span-1 h-fit rounded-full px-2 lg:order-1 lg:col-span-3 lg:pl-2">
          <div class="h-[20em]">
            <Leaflet popups={coords} />
          </div>
        </div>

        <div class="order-1 row-span-1  rounded-xl lg:order-2 lg:col-span-2">
          <div class="grid gap-2 px-2 md:grid-cols-2 lg:grid-cols-2 lg:gap-2">
            <div class="min-h-[45em]">
              {events.value?.map((ev) => (
                <EventCard
                  link={`/join/${ev.eventID}`}
                  key={ev.eventID}
                  title={ev.name}
                  description={ev.description}
                  time={ev.date}
                  attendees={0}
                  tags={[]}
                />
              )) || (
                <div class=" grid h-[44em] w-full grid-rows-2 gap-2">
                  <EmptyEventCard />
                  <EmptyEventCard />
                </div>
              )}
            </div>
            {events.value && events.value.length > 3 && (
              <Link
                href="/join"
                class=" rounded-lg bg-black  p-2 text-center text-white md:hidden"
              >
                See more
              </Link>
            )}
          </div>
        </div>
      </div>
      <div class=" order-last px-2 pt-2">
        <h1 class="  pb-2 text-2xl  font-medium ">Good locations</h1>
        <div class=" flex  w-full flex-col content-center gap-2  md:flex-row lg:gap-4 ">
          <LocationCard
            name="Esplanda"
            link="/montreal"
            tags={["festival", "city"]}
            rating={5}
            address="Montreal, Quebec, Canada"
            description="The city of festivals"
          />
          <LocationCard
            name="Esplanda"
            link="/montreal"
            tags={["festival", "city"]}
            rating={5}
            address="Montreal, Quebec, Canada"
            description="The city of festivals"
          />
          <LocationCard
            name="Esplanda"
            link="/montreal"
            tags={["festival", "city"]}
            rating={5}
            address="Montreal, Quebec, Canada"
            description="The city of festivals"
          />
          <NewLocation />
        </div>
      </div>
    </div>
  );
});
