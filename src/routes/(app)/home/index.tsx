import { component$ } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import { EventCard } from "@/components/app/eventCard/EventCard";
import type { popupsData } from "~/models/map";
import { routeLoader$, routeAction$, Link } from "@builder.io/qwik-city";
import {
  LocationCard,
  ShareLocationCard,
} from "@/components/app/LocationCard/LocationCard";
import { getEvents } from "~/api/EndPoint";
import { QueryPlaces } from "~/api/Query";
import { drizzler } from "~/api/drizzled";

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
  const data = getEvents({
    event: event,
    options: {
      limit: 100,
    },
  });
  return data;
});
export const usePlaces = routeLoader$(async (event) => {
  const client = await drizzler(event);
  const data = await QueryPlaces({
    event: event,
    client: client,
    params: {
      limit: 25,
    },
  });
  return { data: data.data, success: data.success };
});

export const useMapData = routeLoader$(async () => {
  const coords: popupsData = [
    {
      name: "place  central",
      coords: [45.5017, -73.5673],
      description: "The city of festivals",
      date: "2021-09-12",
      link: "/join/1",
    },
    {
      name: "place demi",
      date: "2021-09-12",
      description: "The city of festivals",
      coords: [45.5017, -72.5673],
      link: "/join/2",
    },
  ];
  return coords;
});
export default component$(() => {
  const events = useEvents();
  const places = usePlaces();
  const first = places.value.data?.[0];
  const others = places.value.data?.slice(1);
  console.log("places", places.value.data);
  const placesData =
    events.value.data?.map((event) => ({
      name: event.name,
      Image: event.image,
      link: `/join/${event.eventID}`,
      date: event.date,
      description: event.description,
      coords: [event.place?.Lat ?? 0, event.place?.Lng ?? 0] as [
        number,
        number,
      ],
    })) || [];
  const placeSignal = useSignal(placesData);
  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class="  py-2  md:px-2   ">
        <h1 class="px-2  text-3xl font-medium md:px-0 ">Community</h1>
        <p class="text-md    px-2 font-thin text-black  md:px-0">
          {" "}
          See who active this week
        </p>
      </div>
      <div class="flex flex-col gap-5 md:gap-2 lg:grid lg:h-[50em] lg:grid-cols-5 xl:h-fit">
        <div class="order-2 row-span-1 h-fit rounded-full px-2 lg:order-1 lg:col-span-3 lg:pl-2">
          <Leaflet popups={placeSignal} />
        </div>

        <div class="order-1 row-span-1  rounded-xl lg:order-2 lg:col-span-2">
          <div class="grid max-h-[45rem] gap-2 overflow-scroll px-2 md:grid-cols-2 lg:grid-cols-2 lg:gap-2">
            {events.value.data && events.value.data.length > 0 ? (
              <>
                {events.value.data.map((ev) => (
                  <EventCard
                    link={`/join/${ev.eventID}`}
                    key={ev.eventID}
                    title={ev.name}
                    description={ev.description}
                    time={ev.date}
                    image={ev.image as string}
                    placeID={ev.placeId as number}
                    attendees={0}
                    tags={[]}
                  />
                ))}
              </>
            ) : (
              <div class="flex flex-col gap-2"></div>
            )}
            {events.value.data && events.value.data.length > 3 && (
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
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {first && (
            <LocationCard
              name={first.Name}
              link={`/location/${first.PlaceID}`}
              image={first.ImageURL as string}
              tags={first.Tags || []}
              rating={first.Rating}
              address={first.Address}
              description={first.Description}
              id={first.PlaceID}
            />
          )}
          <ShareLocationCard />
          {others &&
            others.map((content) => (
              <LocationCard
                key={content.PlaceID}
                image={content.ImageURL as string}
                name={content.Name}
                link={`/location/${content.PlaceID}`}
                tags={content.Tags || []}
                rating={content.Rating}
                address={content.Address}
                description={content.Description}
                id={content.PlaceID}
              />
            ))}
        </div>
      </div>
    </div>
  );
});
