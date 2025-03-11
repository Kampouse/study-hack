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
      limit: 75,
    },
  });
  return { data: data.data, success: data.success };
});

export default component$(() => {
  const events = useEvents();
  const places = usePlaces();
  const visibleEvents = useSignal(6);
  const first = places.value.data?.[0];
  const others = places.value.data?.slice(1);
  const showMap = useSignal(false);
  const searchTerm = useSignal("");
  const startDate = useSignal("");
  const endDate = useSignal("");

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

  const filteredEvents = events.value.data?.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      event.description
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      (event.place?.Name || "")
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());

    const eventDate = new Date(event.date);
    const isAfterStart =
      !startDate.value || eventDate >= new Date(startDate.value);
    const isBeforeEnd = !endDate.value || eventDate <= new Date(endDate.value);

    return matchesSearch && isAfterStart && isBeforeEnd;
  });

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto max-w-7xl px-4 py-8">
        <div class="mb-16">
          <header class="mb-8">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900">
              Upcoming Sessions
            </h1>
            <div class="mt-2 flex items-center justify-between">
              <p class="text-lg text-gray-600">
                Find the best co-working spaces and groups near you
              </p>
              <button
                onClick$={() => (showMap.value = !showMap.value)}
                class="inline-flex items-center rounded-lg bg-black px-6 py-3 text-base font-medium text-white transition duration-150 ease-in-out hover:bg-gray-800"
              >
                {showMap.value ? "Hide Map" : "Show Map"}
              </button>
            </div>
          </header>
          <div class="mb-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm.value}
                onInput$={(e) =>
                  (searchTerm.value = (e.target as HTMLInputElement).value)
                }
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none md:flex-1"
              />
              <div class="flex gap-2 md:flex-1">
                <input
                  type="date"
                  value={startDate.value}
                  placeholder="Start date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange$={(e) =>
                    (startDate.value = (e.target as HTMLInputElement).value)
                  }
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                />
                <input
                  type="date"
                  value={endDate.value}
                  placeholder="End date"
                  min={
                    startDate.value || new Date().toISOString().split("T")[0]
                  }
                  onChange$={(e) =>
                    (endDate.value = (e.target as HTMLInputElement).value)
                  }
                  class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <button
                onClick$={() => {
                  searchTerm.value = "";
                  startDate.value = "";
                  endDate.value = "";
                }}
                class="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-200 md:w-auto"
              >
                Reset Filters
              </button>
            </div>
          </div>
          {showMap.value && (
            <div class="mb-8 h-[400px] overflow-hidden rounded-2xl shadow-lg">
              <Leaflet events={Events} places={plas} />
            </div>
          )}

          <div class="grid gap-8">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents && filteredEvents.length > 0 ? (
                <>
                  {filteredEvents.slice(0, visibleEvents.value).map((ev) => (
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
                      placeName={ev.place?.Name as string}
                      attendees={ev.attendees || 0}
                      host={ev.host}
                      tags={[]}
                    />
                  ))}
                  {filteredEvents.length > visibleEvents.value && (
                    <div class="col-span-full mt-4 flex justify-center">
                      <button
                        onClick$={() => (visibleEvents.value += 3)}
                        class="inline-flex items-center rounded-lg bg-black px-6 py-3 text-base font-medium text-white transition duration-150 ease-in-out hover:bg-gray-800"
                      >
                        Show More Events
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div class="col-span-full flex h-full flex-col items-center justify-center gap-6 rounded-2xl bg-white p-8 text-center shadow-sm">
                  <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <img
                      src="https://media.tenor.com/images/b2b4775788bc9666eebb0a00355948ec/tenor.gif"
                      alt="Sad cat"
                      class="h-12 w-12"
                      width="48"
                      height="48"
                    />
                  </div>
                  <h2 class="text-3xl font-bold text-gray-900">
                    No Events Found
                  </h2>
                  <p class="text-lg text-gray-600">
                    Subscribe to get notified when new events are posted
                  </p>
                  <Link
                    href="/subscribe"
                    class="inline-flex items-center rounded-lg bg-black px-6 py-3 text-base font-medium text-white transition duration-150 ease-in-out hover:bg-gray-800"
                  >
                    Subscribe Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <section class="border-t border-gray-200 pt-16">
          <h2 class="mb-6 text-3xl font-bold tracking-tight text-gray-900">
            Featured Locations
          </h2>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              others
                .slice(0, 4)
                .map((content) => (
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
          {places.value.data && places.value.data.length > 6 && (
            <div class="mt-8 text-center">
              <Link
                href="/places"
                class="inline-flex items-center rounded-lg bg-black px-8 py-3 text-base font-medium text-white transition duration-150 ease-in-out hover:bg-gray-800"
              >
                View All Locations
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
});
