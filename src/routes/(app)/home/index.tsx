import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { MapPinIcon as MapPin } from "lucide-qwik"; // Keep MapPin for the modal button

import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import { getEvents } from "~/api/EndPoint";
import { QueryPlaces } from "~/api/Query";
import { drizzler } from "~/api/drizzled";

// Import components from the same directory
import { HeroSection } from "./hero-section";
import { CommunitySection } from "./community-section";
import { TabsSection } from "./tabs-section";
export type Events = Awaited<ReturnType<typeof useEvents>>;

export const head = {
  title: " S&H | Home",
};

export const useEvents = routeLoader$(async (event) => {
  const data = await getEvents({
    event: event,
    options: {
      limit: 1000, // Consider pagination or smaller limits for performance
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
      limit: 75, // Consider pagination
    },
  });
  return { data: data.data, success: data.success };
});

export default component$(() => {
  const events = useEvents();
  const places = usePlaces();
  const showMap = useSignal(false);
  const combinedMapData = useSignal<unknown>();
  // --- Data Transformation (Remains the same) ---
  const placesDataForMap =
    places.value.data?.map((place) => {
      const coordinates = place.Places?.Coordinates || [0, 0];
      return {
        id: place.Places?.PlaceID,
        name: place.Places?.Name,
        image: (place.Places?.ImageURL as string) || "/placeholder.svg",
        badge: "Place",
        location: place.Places?.Address,
        description: place.Places?.Description,
        tags: place.Places?.Tags || ["Quiet", "WiFi", "Coffee"],
        creator: place.Users?.Username, // Placeholder
        rating: place.Places?.Rating || 4.8,
        coords: coordinates as [number, number],
      };
    }) || [];

  // Add events to the map data as well
  const eventsDataForMap =
    events.value.data?.map((event) => {
      const coordinates = event.place?.Places?.Coordinates || [0, 0];
      return {
        id: event.eventID,
        name: event.name,
        image: event.image || "/placeholder.svg",
        badge: "Event",
        location: event.place?.Places?.Name || "Location TBD",
        description: event.description,
        tags: ["Study", "Meetup"],
        creator: event.creator || "Anonymous",
        rating: 4.7, // Placeholder for events
        coords: coordinates as [number, number],
      };
    }) || [];
  combinedMapData.value = [...placesDataForMap, ...eventsDataForMap];

  const eventsDataForCards =
    events.value.data?.map((event) => ({
      id: event.eventID,
      title: event.name,
      image: event.image || "/placeholder.svg",
      badge: "Event", // Or derive from event type/tags
      type: "Study Group", // Or derive from event type
      date: event.date.split(" ")[0],
      time: event.starttime.split(":")[0] + ":" + event.starttime.split(":")[1],
      location: event.location || "Location TBD",
      creator: event.creator || "Anonymous",
      attendees: event.attendees ?? 8, // Fetch real attendee count if available
      spotsLeft: 5, // Fetch real spots left if available
    })) || [];

  const placesApiDataForCards =
    places.value.data?.map((place) => {
      const coordinates = place.Places?.Coordinates || [0, 0];
      return {
        id: place.Places?.PlaceID,
        name: place.Places?.Name,
        image: place.Places?.ImageURL as string,
        badge: "Popular", // Or derive dynamically
        location: place.Places?.Address,
        description: place.Places?.Description,
        tags: place.Places?.Tags || ["Quiet", "WiFi", "Coffee"],
        creator: place.Users?.Username, // Placeholder
        rating: place.Places?.Rating || 4.8,
        coords: coordinates as [number, number],
      };
    }) || [];
  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      <HeroSection />

      <TabsSection
        placesApiData={placesApiDataForCards}
        eventsData={eventsDataForCards}
      />

      <CommunitySection />

      {showMap.value && (
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div class="relative h-[90vh] w-[90vw] max-w-6xl rounded-lg bg-white p-4 shadow-2xl">
            <div class="mb-2 flex items-center justify-between border-b pb-2">
              <h2 class="text-xl font-semibold text-[#5B3E29]">
                Locations Map
              </h2>
              <button
                onClick$={() => (showMap.value = false)}
                class="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close map"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="h-[calc(90vh-6rem)] w-full overflow-hidden rounded-md border border-[#E6D7C3]">
              <Leaflet
                // Pass combined places and events data for markers
                places={combinedMapData as any}
                // TODO: Get user's actual location or a default center
                location={[51.505, -0.09] as any} // Default location
              />
            </div>
          </div>
        </div>
      )}

      {/* Button to Open Map - Could be placed in Hero or Tabs section header */}
      {/* Example placement: Fixed bottom right */}
      <button
        type="button"
        onClick$={() => (showMap.value = true)}
        class="fixed bottom-24 right-6 z-40 inline-flex h-12 items-center justify-center rounded-full bg-[#D98E73] px-5 py-2 text-sm font-medium text-white shadow-lg ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <MapPin class="mr-2 h-5 w-5" />
        View Map
      </button>
    </div>
  );
});
