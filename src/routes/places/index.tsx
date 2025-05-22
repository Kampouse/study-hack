import { component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import { MapPinIcon as MapPin, FilterIcon, XIcon } from "lucide-qwik";
import { PlaceCard } from "~/routes/(app)/home/place-card";
import { QueryPlaces } from "~/api/Query";
import { drizzler } from "~/api/drizzled";

export const head = {
  title: "S&H | Places",
};

export const usePlaces = routeLoader$(async (event) => {
  const client = await drizzler(event);
  const data = await QueryPlaces({
    event: event,
    client: client,
    params: {
      limit: 100, // Increased limit for the dedicated places page
    },
  });
  return { data: data.data, success: data.success };
});

export default component$(() => {
  const places = usePlaces();
  const showMap = useSignal(false);
  const searchTerm = useSignal("");
  const filterCategory = useSignal("all");
  const visiblePlacesCount = useSignal(12);
  const sidebarOpen = useSignal(false);

  // Transform places data for use with PlaceCard component
  const placesDataForCards =
    places.value.data?.map((place) => {
      return {
        id: place.Places?.PlaceID,
        name: place.Places?.Name,
        image: place.Places?.ImageURL as string,
        badge: "New",
        location: place.Places?.Address,
        description: place.Places?.Description,
        tags: ["Quiet", "WiFi", "Coffee"], // Fetch real tags if available
        creator: place.Users?.Username, // Placeholder
        rating: place.Places?.Rating || 4.8, // Fetch real rating
        coords: [place.Places?.Lat, place.Places?.Lng] as [number, number],
      };
    }) || [];

  // Filter places based on search term and category
  const filteredPlaces = placesDataForCards.filter((place) => {
    const matchesSearch =
      place.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      place.description
        ?.toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      place.location?.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesCategory =
      filterCategory.value === "all" ||
      (filterCategory.value === "new" && place.badge === "New") ||
      (filterCategory.value === "popular" && place.badge === "Popular");

    return matchesSearch && matchesCategory;
  });

  const allPlacesLoaded = visiblePlacesCount.value >= filteredPlaces.length;

  return (
    <div class="flex min-h-screen flex-col bg-[#FFF8F0] md:flex-row">
      {/* Mobile Filter Button */}
      <div class="fixed bottom-4 right-4 z-30 md:hidden">
        <button
          onClick$={() => (sidebarOpen.value = true)}
          class="flex h-12 w-12 items-center justify-center rounded-full bg-[#D98E73] text-white shadow-lg"
          aria-label="Open filters"
        >
          <FilterIcon class="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {sidebarOpen.value && (
        <div
          class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick$={() => (sidebarOpen.value = false)}
        ></div>
      )}

      {/* Left Search Panel - Fixed position instead of sticky */}
      <div
        class={`fixed inset-y-0 left-0  z-50 w-80 transform overflow-y-auto border-r border-[#E6D7C3] bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen.value ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div class="flex items-center justify-between md:mt-20">
          <button
            onClick$={() => (sidebarOpen.value = false)}
            class="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 md:hidden"
            aria-label="Close filters"
          >
            <XIcon class="h-6 w-6" />
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D98E73]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search places..."
              class="h-12 w-full rounded-lg border-2 border-[#E6D7C3] bg-white py-3 pl-10 pr-4 text-[#5B3E29] placeholder-[#A99D8F] shadow-sm transition-all focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
              bind:value={searchTerm}
            />
          </div>
        </div>

        <div class="mt-6 space-y-6">
          <div class="space-y-3">
            <h3 class="text-sm font-medium uppercase tracking-wider text-[#8B5A2B]">
              Filter By
            </h3>
            <select
              class="h-10 w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#5B3E29] focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
              bind:value={filterCategory}
            >
              <option value="all">All Places</option>
              <option value="new">New Places</option>
              <option value="popular">Popular Places</option>
            </select>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-medium uppercase tracking-wider text-[#8B5A2B]">
              Amenities
            </h3>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="rounded border-[#E6D7C3] text-[#D98E73]"
                />
                <span class="ml-2 text-sm text-[#5B3E29]">
                  Quiet Environment
                </span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="rounded border-[#E6D7C3] text-[#D98E73]"
                />
                <span class="ml-2 text-sm text-[#5B3E29]">WiFi Available</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="rounded border-[#E6D7C3] text-[#D98E73]"
                />
                <span class="ml-2 text-sm text-[#5B3E29]">Coffee Served</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="rounded border-[#E6D7C3] text-[#D98E73]"
                />
                <span class="ml-2 text-sm text-[#5B3E29]">Study-Friendly</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="rounded border-[#E6D7C3] text-[#D98E73]"
                />
                <span class="ml-2 text-sm text-[#5B3E29]">
                  Outlets Available
                </span>
              </label>
            </div>
          </div>

          <div class="border-t border-[#E6D7C3] pt-4">
            <button
              type="button"
              onClick$={() => {
                showMap.value = true;
                sidebarOpen.value = false; // Close sidebar when opening map on mobile
              }}
              class="inline-flex h-10 w-full items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <MapPin class="mr-2 h-4 w-4" />
              View on Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div class="ml-80 flex-1 overflow-auto">
        <section class="container px-4 py-8 pt-16 md:px-6 md:pt-24">
          {filteredPlaces.length > 0 ? (
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlaces
                .slice(0, visiblePlacesCount.value)
                .map((place) => (
                  <PlaceCard key={place.id} place={place as any} />
                ))}

              {/* Always include the share card at the end */}
              {visiblePlacesCount.value < filteredPlaces.length ||
                filteredPlaces.length === 0 ||
                filteredPlaces.length % 3 !== 0}
            </div>
          ) : (
            <div class="rounded-lg bg-[#F8EDE3] p-8 text-center">
              <h3 class="text-lg font-semibold text-[#5B3E29]">
                No places found
              </h3>
              <p class="mt-2 text-[#6D5D4E]">
                Try adjusting your search terms or filters, or be the first to
                share a new place!
              </p>
              <div class="mt-6">
                <Link
                  href="/places/new"
                  class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Share a New Place
                </Link>
              </div>
            </div>
          )}

          {/* Load more button */}
          {!allPlacesLoaded && filteredPlaces.length > 0 && (
            <div class="mt-10 text-center">
              <button
                type="button"
                onClick$={() => {
                  visiblePlacesCount.value += 8; // Load 8 more places
                }}
                class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-8 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Load More Places
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Map modal (simplified - you would integrate with your existing map component) */}
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
              {/* Map component would go here - similar to what's in home/index.tsx */}
              <div class="flex h-full items-center justify-center bg-[#F8EDE3]">
                <p class="text-[#5B3E29]">Map View Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
