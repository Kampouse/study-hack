import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { ArrowRightIcon as ArrowRight, XIcon } from "lucide-qwik";
import { PlaceCard } from "./place-card";
import { SharePlaceCard } from "./share-place-card";
import { EventCard } from "./event-card";
import { CreateEventCard } from "./create-event-card";
import { DetailedEventCard } from "./detailed-event-card";
import { LargeCreateEventCard } from "./large-create-event-card";

import { useLocation } from "@builder.io/qwik-city";

interface TabsSectionProps {
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

  // Filter state variables with proper TypeScript types
  const showPlacesFilter = useSignal<boolean>(false);
  const showEventsFilter = useSignal<boolean>(false);
  const searchTerm = useSignal<string>("");
  const placeFilterCategory = useSignal<string>("all");
  const eventFilterDateRange = useSignal<string>("all");

  const allPlacesLoaded =
    visiblePlacesCount.value >= props.placesApiData.length;
  const allEventsLoaded = visibleEventsCount.value >= props.eventsData.length;

  return (
    <section class="px-4 py-8 pt-0 md:px-6">
      <div class="w-full">
        {/* Tab Triggers */}
        <div class="relative mb-8 grid grid-cols-3 rounded-lg bg-[#F8EDE3] p-1">
          <Link
            href="/home?tab=all"
            scroll={false}
            class={`rounded-lg px-6 py-2 text-center text-[#6D5D4E] transition-all duration-300 ease-in-out ${
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
            class={`inline-block rounded-lg px-6 py-2 text-center text-[#6D5D4E] transition-all duration-300 ease-in-out ${
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
            class={`rounded-lg px-6 py-2 text-center text-[#6D5D4E] transition-all duration-300 ease-in-out ${
              activeTab.value === "places"
                ? "bg-white text-[#5B3E29] shadow-sm"
                : "hover:bg-[#F1DFC6]/50"
            }`}
          >
            Places
          </Link>
        </div>

        {showPlacesFilter.value && (
          <div class="mb-6 rounded-lg border border-[#E6D7C3] bg-white p-4">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-medium text-[#5B3E29]">Filter Places</h3>
              <button
                onClick$={() => (showPlacesFilter.value = false)}
                class="text-[#6D5D4E] hover:text-[#5B3E29]"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-[#5B3E29]">
                  Category
                </label>
                <select
                  bind:value={placeFilterCategory}
                  class="w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#5B3E29] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                >
                  <option value="all">All Places</option>
                  <option value="popular">Popular</option>
                  <option value="coffee">Coffee Shops</option>
                  <option value="quiet">Quiet Spaces</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-[#5B3E29]">
                  Search
                </label>
                <input
                  type="text"
                  bind:value={searchTerm}
                  placeholder="Search places..."
                  class="w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                />
              </div>
            </div>
          </div>
        )}

        {showEventsFilter.value && (
          <div class="mb-6 rounded-lg border border-[#E6D7C3] bg-white p-4">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-medium text-[#5B3E29]">Filter Events</h3>
              <button
                onClick$={() => (showEventsFilter.value = false)}
                class="text-[#6D5D4E] hover:text-[#5B3E29]"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-[#5B3E29]">
                  Date Range
                </label>
                <select
                  bind:value={eventFilterDateRange}
                  class="w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#5B3E29] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                >
                  <option value="all">All Dates</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="this_year">This Year</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-[#5B3E29]">
                  Search
                </label>
                <input
                  type="text"
                  bind:value={searchTerm}
                  placeholder="Search events..."
                  class="w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                />
              </div>
            </div>
          </div>
        )}

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
              <div class="grid gap-6 md:grid-cols-4">
                {/* Show first 4 events + Create Card */}
                {props.eventsData.slice(0, 3).map((event) => (
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
                  onClick$={() =>
                    (showPlacesFilter.value = !showPlacesFilter.value)
                  }
                  class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Filters
                  {showPlacesFilter.value ? (
                    <XIcon class="ml-2 h-4 w-4" />
                  ) : null}
                </button>
              </div>
            </div>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Filter places based on search term and category */}
              {props.placesApiData
                .filter((place) => {
                  const matchesSearch =
                    searchTerm.value === "" ||
                    place.name
                      ?.toLowerCase()
                      .includes(searchTerm.value.toLowerCase()) ||
                    place.description
                      ?.toLowerCase()
                      .includes(searchTerm.value.toLowerCase());

                  const matchesCategory =
                    placeFilterCategory.value === "all" ||
                    (placeFilterCategory.value === "popular" &&
                      place.badge === "Popular") ||
                    (placeFilterCategory.value === "coffee" &&
                      place.tags?.includes("Coffee")) ||
                    (placeFilterCategory.value === "quiet" &&
                      place.tags?.includes("Quiet"));

                  return matchesSearch && matchesCategory;
                })
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
                  onClick$={() =>
                    (showEventsFilter.value = !showEventsFilter.value)
                  }
                  class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Filters
                  {showEventsFilter.value ? (
                    <XIcon class="ml-2 h-4 w-4" />
                  ) : null}
                </button>
              </div>
            </div>
            <div class="space-y-6">
              {/* Filter events based on search term and date range */}
              {props.eventsData
                .filter((event) => {
                  const matchesSearch =
                    searchTerm.value === "" ||
                    event.name
                      ?.toLowerCase()
                      .includes(searchTerm.value.toLowerCase()) ||
                    event.description
                      ?.toLowerCase()
                      .includes(searchTerm.value.toLowerCase());

                  const now = new Date();
                  const eventDate = new Date(event.date);
                  let matchesDateRange = true;

                  if (eventFilterDateRange.value === "this_week") {
                    const weekFromNow = new Date(
                      now.getTime() + 7 * 24 * 60 * 60 * 1000,
                    );
                    matchesDateRange =
                      eventDate >= now && eventDate <= weekFromNow;
                  } else if (eventFilterDateRange.value === "this_month") {
                    const monthFromNow = new Date(
                      now.getTime() + 30 * 24 * 60 * 60 * 1000,
                    );
                    matchesDateRange =
                      eventDate >= now && eventDate <= monthFromNow;
                  }

                  return matchesSearch && matchesDateRange;
                })
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
