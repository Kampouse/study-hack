import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ArrowRightIcon as ArrowRight } from "lucide-qwik";
import { PlaceCard } from "./place-card";
import { SharePlaceCard } from "./share-place-card";
import { EventCard } from "./event-card";
import { CreateEventCard } from "./create-event-card";
import { DetailedEventCard } from "./detailed-event-card";
import { LargeCreateEventCard } from "./large-create-event-card";
import { SearchFilterBar } from "./search-filter";
import { useLocation } from "@builder.io/qwik-city";

export interface TabsSectionProps {
  placesApiData: any[];
  eventsData: any[];
}

// Define how many items to show initially and how many to load more
const INITIAL_PLACES_COUNT = 7; // Show 7 places + 1 share card = 8 items (fits 4-col grid)
const PLACES_INCREMENT = 8;
const INITIAL_EVENTS_COUNT = 4; // Show 4 events initially
const EVENTS_INCREMENT = 4;

export const TabsSection = component$((props: TabsSectionProps) => {
  const loc = useLocation();

  // Get the active tab from URL or default to "all"
  const activeTab = useSignal(loc.url.searchParams.get("tab") ?? "all");

  // Keep tab state in sync with URL parameter
  useTask$(({ track }) => {
    const tab = track(() => loc.url.searchParams.get("tab"));
    activeTab.value = tab ?? "all";
  });

  const visiblePlacesCount = useSignal(INITIAL_PLACES_COUNT);
  const visibleEventsCount = useSignal(INITIAL_EVENTS_COUNT);

  const allPlacesLoaded =
    visiblePlacesCount.value >= props.placesApiData.length;
  const allEventsLoaded = visibleEventsCount.value >= props.eventsData.length;

  return (
    <section class="px-4 py-8 pt-0 md:px-6">
      <div class="w-full">
        {/* Tab Triggers */}
        <div class="relative mb-8 rounded-lg bg-[#F8EDE3] p-1">
          <Link
            href="/home?tab=all"
            scroll={false}
            class={`inline-block rounded-lg px-6 py-2 text-[#6D5D4E] transition-all duration-300 ease-in-out ${
              activeTab.value === "all"
                ? "bg-white text-[#5B3E29] shadow-sm"
                : "hover:bg-[#F1DFC6]/50"
            }`}
          >
            All
          </Link>
          <Link
            scroll={false}
            href="/home?tab=events"
            class={`inline-block rounded-lg px-6 py-2 text-[#6D5D4E] transition-all duration-300 ease-in-out ${
              activeTab.value === "events"
                ? "bg-white text-[#5B3E29] shadow-sm"
                : "hover:bg-[#F1DFC6]/50"
            }`}
          >
            Events
          </Link>
          <Link
            scroll={false}
            href="/home?tab=places"
            class={`inline-block rounded-lg px-6 py-2 text-[#6D5D4E] transition-all duration-300 ease-in-out ${
              activeTab.value === "places"
                ? "bg-white text-[#5B3E29] shadow-sm"
                : "hover:bg-[#F1DFC6]/50"
            }`}
          >
            Places
          </Link>
        </div>

        <SearchFilterBar />

        {/* All Content Tab */}
        {activeTab.value === "all" && (
          <div class="mt-8 space-y-12">
            {/* Featured Places Section */}
            <div>
              <div class="mb-6 flex items-end justify-between">
                <h2 class="text-2xl font-bold text-[#5B3E29]">Cozy Places</h2>
                <Link
                  href="/places"
                  class="flex items-center text-[#D98E73] hover:underline"
                >
                  View all places <ArrowRight class="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Show first 3 places + Share Card */}
                {props.placesApiData.slice(0, 3).map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
                <SharePlaceCard />
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div>
              <div class="mb-6 flex items-end justify-between">
                <h2 class="text-2xl font-bold text-[#5B3E29]">
                  Upcoming Events
                </h2>
                <Link
                  href="/events"
                  class="flex items-center text-[#D98E73] hover:underline"
                >
                  View all events <ArrowRight class="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div class="grid gap-6 md:grid-cols-2">
                {/* Show first 2 events + Create Card */}
                {props.eventsData.slice(0, 2).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
                <CreateEventCard />
              </div>
            </div>
          </div>
        )}

        {/* Places Tab */}
        {activeTab.value === "places" && (
          <div class="mt-8">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-[#5B3E29]">
                Cozy Spaces ({props.placesApiData.length})
              </h2>
              <div class="flex gap-3">
                <select class="rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20">
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Filters
                </button>
              </div>
            </div>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Show limited number of places initially */}
              {props.placesApiData
                .slice(0, visiblePlacesCount.value)
                .map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              {/* Always show SharePlaceCard if not all places loaded or if it fits */}
              {(visiblePlacesCount.value < props.placesApiData.length ||
                props.placesApiData.length === 0 ||
                props.placesApiData.length % 4 !== 0) && <SharePlaceCard />}
            </div>
            {/* Show Load More button only if there are more places to load */}
            {!allPlacesLoaded && (
              <div class="mt-10 text-center">
                <button
                  type="button"
                  onClick$={() => {
                    visiblePlacesCount.value += PLACES_INCREMENT;
                  }}
                  class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-8 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Load More Spaces
                </button>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab.value === "events" && (
          <div class="mt-8">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-[#5B3E29]">
                Upcoming Sessions ({props.eventsData.length})
              </h2>
              <div class="flex gap-3">
                <select class="rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20">
                  <option value="date-asc">Date: Soonest First</option>
                  <option value="date-desc">Date: Latest First</option>
                  <option value="popular">Most Popular</option>
                </select>
                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Filters
                </button>
              </div>
            </div>
            <div class="space-y-6">
              {/* Show limited number of events initially */}
              {props.eventsData
                .slice(0, visibleEventsCount.value)
                .map((event) => (
                  <DetailedEventCard key={event.id} event={event} />
                ))}
              <LargeCreateEventCard />
              {/* Show Load More button only if there are more events to load */}
              {!allEventsLoaded && (
                <div class="mt-8 text-center">
                  <button
                    type="button"
                    onClick$={() => {
                      visibleEventsCount.value += EVENTS_INCREMENT;
                    }}
                    class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-8 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Load More Events
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
