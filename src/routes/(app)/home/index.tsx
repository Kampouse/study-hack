import { component$ } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import { EventCard } from "@/components/app/eventCard/EventCard";
import { routeLoader$, routeAction$, Link } from "@builder.io/qwik-city";
import {
  LocationCard,
  ShareLocationCard,
} from "@/components/app/LocationCard/LocationCard";
import { getEvents } from "~/api/EndPoint";
import { QueryPlaces } from "~/api/Query";
import { drizzler } from "~/api/drizzled";
import type { Place } from "~/models/map";
export type Events = Awaited<ReturnType<typeof useEvents>>;

export const head = {
  title: " S&H | Home",
};
export const useEventAction = routeAction$(() => {
  return {
    success: true,
  };
});
export type EventAction = ReturnType<typeof useEventAction>;

export const useEvents = routeLoader$(async (event) => {
  const data = getEvents({
    event: event,
    options: {
      limit: 1000,
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

export default component$(() => {
  const events = useEvents();
  const places = usePlaces();
  const first = places.value.data?.[0];
  const others = places.value.data?.slice(1);
  const placesData =
    events.value.data?.map((event) => ({
      name: event.name,
      Image: event.image,
      link: `/join/${event.eventID}`,
      date: event.date,
      place: event.place?.Name,
      description: event.description,
      coords: [event.place?.Lat ?? 0, event.place?.Lng ?? 0] as [
        number,
        number,
      ],
    })) || [];
  const Events = useSignal(placesData);

  const placed = places.value.data?.map((el) => {
    return {
      name: el.Name,
      Image: el.ImageURL as string,
      link: `/places/${el.PlaceID}`,
      coords: [el.Lat, el.Lng] as [number, number],
      description: el.Description,
      place: el.Address,
    } satisfies Place;
  });

  const plas = useSignal<Place[] | undefined>(placed);

  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class="  px-5  py-2 md:px-2   ">
        <h1 class="px-2  text-3xl font-medium md:px-0 "> upcoming Sessions</h1>
        <p class="text-md    px-2 font-thin text-black  md:px-0">
          {" "}
          Find the best co-working spaces and groups near you
        </p>
      </div>
      <div class="flex flex-col gap-5 px-5 md:gap-2 md:px-0 lg:grid lg:h-[52em] lg:grid-cols-5 xl:h-fit">
        <div class="order-2 row-span-1 h-fit rounded-full px-2 lg:order-1 lg:col-span-3 lg:pl-2">
          <Leaflet events={Events} places={plas} />
        </div>
        <div class="order-1 row-span-1  rounded-xl lg:order-2 lg:col-span-2">
          {events.value.data && events.value.data.length > 0 ? (
            <div class="grid max-h-[47rem] gap-2 overflow-y-auto md:grid-cols-2 md:px-2 lg:grid-cols-2 lg:gap-2">
              {events.value.data.map((ev) => (
                <EventCard
                  link={
                    ev.host ? `/event/${ev.eventID}` : `/join/${ev.eventID}`
                  }
                  key={ev.eventID}
                  title={ev.name}
                  description={ev.description}
                  time={ev.date}
                  image={ev.image as string}
                  placeID={ev.placeId as number}
                  attendees={ev.attendees || 0}
                  host={ev.host}
                  tags={[]}
                />
              ))}
              {events.value.data.length > 3 && (
                <Link
                  href="/join"
                  class=" rounded-lg bg-black  p-2 text-center text-white md:hidden"
                >
                  See more
                </Link>
              )}
            </div>
          ) : (
            <div class="flex h-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 text-center shadow-sm">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                <img
                  src="https://media.tenor.com/images/b2b4775788bc9666eebb0a00355948ec/tenor.gif"
                  alt="Sad cat"
                  class="h-8 w-8"
                  width="32"
                  height="32"
                />
              </div>
              <h2 class="text-2xl font-medium text-gray-900">
                No Events Found
              </h2>
              <p class="text-gray-500">
                Subscribe to get notified when new events are posted
              </p>
              <Link
                href="/subscribe"
                class="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Subscribe Now
              </Link>
            </div>
          )}
        </div>
      </div>
      <div class=" order-last px-2 pt-2">
        <h1 class="  pb-2 text-2xl  font-medium ">Good locations</h1>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {first && (
            <LocationCard
              name={first.Name}
              link={`/places/${first.PlaceID}`}
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
