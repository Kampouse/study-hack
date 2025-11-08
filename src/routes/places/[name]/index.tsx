import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  HeartIcon,
  MapPinIcon,
  MessageSquareIcon,
  StarIcon,
  UsersIcon,
} from "lucide-qwik";
import { getPlace, getPlaces } from "~/api/EndPoint";
import { GetUser } from "~/api/Query";

const reviewsData = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    timeAgo: "2 days ago",
    rating: 5,
    comment: "Great atmosphere and friendly staff! The coffee here is amazing.",
    helpful: 12,
  },
  {
    initials: "MC",
    name: "Michael Chen",
    timeAgo: "1 week ago",
    rating: 4,
    comment:
      "Perfect spot for working remotely. The WiFi is reliable and there are plenty of power outlets.",
    helpful: 8,
  },
  {
    initials: "ED",
    name: "Emma Davis",
    timeAgo: "2 weeks ago",
    rating: 5,
    comment:
      "Love the ambiance here! It's become my go-to place for meeting friends.",
    helpful: 15,
  },
];

const SuggestedPlaceCard = component$(
  (props: {
    id: number;
    name: string;
    image: string;
    rating: number;
    description: string;
    category?: string;
    distance?: string;
    isOpen?: boolean;
    price?: string;
    tags?: string[];
  }) => {
    const category = props.category || "Workspace";
    const distance = props.distance || "0.5 km away";
    const isOpen = props.isOpen !== undefined ? props.isOpen : true;
    const price = props.price || "$$";
    const tags = props.tags || ["WiFi", "Coffee", "Quiet"];
    return (
      <Link
        href={`/places/${props.name.trim()}`}
        class="group block cursor-pointer overflow-hidden rounded-xl border border-[#E6D7C3]/30 bg-white/80 transition-all duration-300 hover:bg-white hover:shadow-md active:shadow-sm"
      >
        <div class="relative">
          <div class="relative h-28 w-full overflow-hidden sm:h-32">
            <img
              src={props.image}
              alt={props.name}
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              width={300}
              height={128}
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div class="absolute left-2 top-2 sm:left-3 sm:top-3">
            <span class="inline-block rounded-full bg-white/95 px-1.5 py-0.5 text-xs font-medium text-[#8B5A2B] sm:px-2 sm:py-1">
              {category}
            </span>
          </div>

          <div class="absolute right-2 top-2 flex gap-1 sm:right-3 sm:top-3 sm:gap-2">
            <button class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 p-0 hover:bg-white active:bg-white/80 transition-colors sm:h-8 sm:w-8">
              <HeartIcon class="h-3.5 w-3.5 text-[#D98E73] sm:h-4 sm:w-4" />
            </button>
          </div>

          <div class="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white/95 px-1.5 py-0.5 sm:bottom-3 sm:right-3 sm:px-2 sm:py-1">
            <StarIcon class="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 sm:h-3 sm:w-3" />
            <span class="text-xs font-semibold text-[#5B3E29]">
              {props.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div class="p-3 sm:p-4">
          <div class="space-y-2 sm:space-y-3">
            <div>
              <h4 class="truncate font-semibold text-[#5B3E29] text-sm sm:text-base">
                {props.name}
              </h4>
              <p class="line-clamp-2 text-xs text-[#6D5D4E]/70 sm:text-sm sm:line-clamp-1">
                {props.description.substring(0, 60)}...
              </p>
            </div>

            <div class="flex items-center justify-between text-xs sm:text-sm">
              <div class="flex items-center gap-1 text-[#6D5D4E]/70 min-w-0 flex-1">
                <MapPinIcon class="h-3 w-3 flex-shrink-0" />
                <span class="truncate">{distance}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <span class="font-medium text-[#5B3E29] text-xs sm:text-sm">
                  {price}
                </span>
                <div
                  class={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                    isOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>

            <div class="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  class="inline-block rounded-full bg-[#F8D7BD]/80 px-1.5 py-0.5 text-xs text-[#8B5A2B] sm:px-2"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span class="inline-block rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 sm:px-2">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

const ReviewCard = component$(
  (props: {
    initials: string;
    name: string;
    timeAgo: string;
    rating: number;
    comment: string;
    helpful?: number;
  }) => {
    return (
      <div class="flex gap-3 rounded-xl border border-[#E6D7C3]/50 bg-[#F8EDE3]/30 p-3 sm:flex-row sm:gap-4 sm:p-4">
        <div class="flex-shrink-0">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D98E73] to-[#C27B62] font-semibold text-sm text-white ring-2 ring-[#F8D7BD] sm:h-12 sm:w-12">
            {props.initials}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="mb-2 flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center sm:gap-0">
            <h3 class="font-semibold text-[#5B3E29] text-sm sm:text-base truncate">
              {props.name}
            </h3>
            <p class="text-xs text-[#6D5D4E]/70 flex-shrink-0">
              {props.timeAgo}
            </p>
          </div>
          <div class="mb-2.5 flex items-center gap-2 sm:mb-3">
            <div class="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  class={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    star <= props.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span class="text-sm font-medium text-[#5B3E29]">
              {props.rating}.0
            </span>
          </div>
          <p class="mb-3 text-sm text-[#6D5D4E]/80 leading-relaxed sm:mb-3">
            {props.comment}
          </p>
          <div class="flex items-center gap-3 text-xs text-[#6D5D4E]/70 sm:gap-4 sm:text-sm">
            <button class="transition-colors hover:text-[#8B5A2B] active:scale-95 touch-manipulation flex items-center gap-1">
              👍 Helpful ({props.helpful || 0})
            </button>
            <button class="transition-colors hover:text-[#8B5A2B] active:scale-95 touch-manipulation">
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export const useloadPlace = routeLoader$(async (context) => {
  const output = decodeURIComponent(context.params.name);
  // Check if the output is a valid number
  const id = Number.parseInt(output, 10);
  const isId = !isNaN(id);

  // Query getPlace with id when output is a number, otherwise use placeName
  const user = await GetUser({ event: context });
  const data = await getPlace({
    event: context,
    placeName: isId ? undefined : output,
    id: isId ? id : undefined,
  });

  return { ...data, user: user };
});

export const useLoadSuggestedPlaces = routeLoader$(async (context) => {
  const output = decodeURIComponent(context.params.name);
  const currentPlace = await getPlace({
    event: context,
    placeName: output,
  });

  //  const currentId = currentPlace.data?.PlaceID || 0;
  const places = await getPlaces(context, {
    limit: 3,
    exclude: [currentPlace.data?.PlaceID || 0],
  });
  return places.data?.slice(0, 3).map((place) => ({
    id: place.Places?.PlaceID || 0,
    name: place.Places?.Name || "",
    image: place.Places?.ImageURL || "https://via.placeholder.com/300x200",
    rating: place.Places?.Rating || 0,
    description: place.Places?.Description || "",
    category: ["Workspace", "Café", "Studio"][Math.floor(Math.random() * 3)],
    distance: `${(Math.random() * 2 + 0.1).toFixed(1)} km away`,
    isOpen: Math.random() > 0.2,
    price: ["$", "$$", "$$$"][Math.floor(Math.random() * 3)],
    tags: [
      ["WiFi", "Coffee", "Quiet"],
      ["Outdoor", "Peaceful", "Books"],
      ["Art", "Events", "Community"],
    ][Math.floor(Math.random() * 3)],
  }));
});

export default component$(() => {
  const place = useloadPlace();
  const suggestedPlaces = useLoadSuggestedPlaces();

  return (
    <div class="min-h-screen bg-gradient-to-br from-[#F8EDE3] to-[#FFF8F0] md:pt-20">
      {/* Header - Mobile friendly */}

      <div class="mx-auto flex max-w-7xl flex-col px-3 py-4 pt-16 sm:px-4 sm:pt-20 lg:flex-row lg:gap-6 lg:p-6 lg:pt-24">
        {/* Main Content */}
        <div class="flex-1 space-y-6">
          {/* Hero Section */}
          <div class="overflow-hidden rounded-xl border-[#E6D7C3]/40 bg-white/90 shadow-xl backdrop-blur-sm">
            <div class="relative">
              <img
                src={(place.value.data?.ImageURL as string) || ""}
                alt={place.value.data?.Name}
                class="h-[200px] w-full object-cover sm:h-[300px] md:h-[450px]"
                width={824}
                height={450}
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Overlay Content */}
              <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                <div class="flex items-end justify-between gap-3">
                  <div class="flex-1 rounded-xl bg-black/30 px-3 py-2 text-white backdrop-blur-sm sm:px-4 sm:py-3">
                    <h2 class="mb-1 text-lg font-bold leading-tight sm:mb-2 sm:text-xl md:text-2xl">
                      {place.value.data?.Name}
                    </h2>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            class={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
                              star <= (place.value.data?.Rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span class="text-xs font-medium sm:text-sm">
                        {place.value.data?.Rating.toFixed(1) || "0.0"} (127
                        reviews)
                      </span>
                    </div>
                  </div>
                  {/* Like button in hero section */}
                  <button
                    type="button"
                    onClick$={() => console.log("Liked place!")}
                    class="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-[#D98E73] hover:shadow-lg active:scale-95 sm:h-12 sm:w-12"
                    aria-label="Like this place"
                  >
                    <HeartIcon class="h-5 w-5 text-[#D98E73] transition-all group-hover:text-white sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Create Event Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#D98E73] sm:h-12 sm:w-12">
                <UsersIcon class="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="mb-1 text-base font-semibold text-[#5B3E29] sm:text-lg">
                  {place.value.data?.Name}
                </h3>
                <p class="text-sm text-[#6D5D4E]/70">
                  Create your own event and connect with like-minded people
                </p>
              </div>
              <Link
                href={`/new?placeId=${place.value.data?.PlaceID}`}
                class="w-full rounded-lg bg-[#D98E73] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#C27B62] active:bg-[#B56B58] active:scale-[0.98] touch-manipulation sm:w-auto sm:px-6 sm:py-2"
              >
                Create Event Here
              </Link>
            </div>
          </div>

          {/* Location & Info Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            {/* Description Section with improved spacing */}
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <h3 class="mb-3 text-lg font-semibold text-[#5B3E29] md:text-xl">
                  About this place
                </h3>
                <div class="flex gap-2">
                  {place.value.data?.UserID === place.value.user?.ID && (
                    <Link
                      href={`/places/${place.value.data?.Name}/edit`}
                      class="flex items-center gap-1.5 rounded-lg bg-[#F8D7BD] px-3 py-1.5 text-sm font-medium text-[#8B5A2B] transition-colors hover:bg-[#D98E73] hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-4 w-4"
                      >
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                      Edit Place
                    </Link>
                  )}
                </div>
              </div>
              <p class="leading-relaxed text-[#6D5D4E]/80 md:text-base">
                {place.value.data?.Description}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                {place.value.data?.Tags?.map((tag) => (
                  <span
                    key={tag}
                    class="inline-block rounded-full border border-[#E6D7C3] px-3 py-1 text-xs font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD]/20 sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div class="border-t border-[#E6D7C3]/50 pt-6">
              {/* Combined Quick Info and Location in one box */}
              <div class="rounded-lg bg-[#F8EDE3]/30 p-4">
                <div class="mb-4 flex items-center justify-between">
                  <h3 class="flex items-center gap-2 text-lg font-semibold text-[#5B3E29]">
                    <StarIcon class="h-5 w-5 text-[#D98E73]" />
                    Quick Info
                  </h3>
                </div>

                <div class="space-y-3">
                  {/* Rating */}
                  <div class="flex items-center justify-between rounded-md bg-white/50 p-2.5">
                    <span class="text-sm text-[#6D5D4E]/80 md:text-base">
                      Rating
                    </span>
                    <div class="flex items-center gap-1.5">
                      <div class="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            class={`h-4 w-4 ${
                              star <= (place.value.data?.Rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span class="font-medium text-[#5B3E29]">
                        {place.value.data?.Rating.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div class="flex items-center justify-between rounded-md bg-white/50 p-2.5">
                    <span class="text-sm text-[#6D5D4E]/80 md:text-base">
                      Price Range
                    </span>
                    <span class="font-medium text-[#5B3E29]">$$</span>
                  </div>

                  {/* Location */}
                  <div class="rounded-md bg-white/50 p-2.5">
                    <div class="mb-1 flex items-center justify-between">
                      <span class="text-sm text-[#6D5D4E]/80 md:text-base">
                        Address
                      </span>
                    </div>
                    <div class="text-[#6D5D4E]">
                      <p class="text-sm md:text-base">
                        {place.value.data?.Address}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div class="mt-3 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        place.value.data?.Address || ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center justify-center gap-1.5 rounded-lg bg-[#D98E73] px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C27B62] active:bg-[#B56B58] active:scale-[0.98] touch-manipulation sm:flex-1 sm:px-4 sm:py-2"
                    >
                      <MapPinIcon class="h-4 w-4" />
                      <span class="truncate">Directions</span>
                    </a>
                    {/* Like button next to Directions */}
                    <button
                      type="button"
                      onClick$={() => console.log("Bookmarked place!")}
                      class="flex items-center justify-center gap-1.5 rounded-lg border border-[#D98E73] bg-white px-3 py-2.5 text-sm font-medium text-[#D98E73] transition-colors hover:bg-[#FFF1E6] active:bg-[#F8EDE3] active:scale-[0.98] touch-manipulation sm:flex-1 sm:px-4 sm:py-2"
                    >
                      <HeartIcon class="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:p-6">
            <div class="mb-4">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 class="flex items-center gap-2 text-lg font-semibold text-[#5B3E29] sm:text-xl">
                  <MessageSquareIcon class="h-5 w-5" />
                  Reviews & Comments
                </h2>
              </div>
            </div>
            <div class="space-y-4 sm:space-y-6">
              {reviewsData.map((review) => (
                <ReviewCard key={review.initials} {...review} />
              ))}
            </div>
          </div>

          {/* Mobile Recommendations (only visible on mobile) */}
          <div class="block rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-lg backdrop-blur-sm lg:hidden">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-[#5B3E29] sm:text-xl">
                You might also like
              </h3>
              <p class="text-sm text-[#6D5D4E]/70">
                Discover similar places nearby
              </p>
            </div>
            <div class="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
              {suggestedPlaces.value?.map((place) => (
                <SuggestedPlaceCard key={place.id} {...place} />
              )) || []}
            </div>
            <div class="pt-6">
              <Link
                href="/places"
                class="block w-full rounded-xl bg-gradient-to-r from-[#D98E73] to-[#C27B62] py-3 text-center font-medium text-white shadow-lg transition-all hover:from-[#C27B62] hover:to-[#A6654E] active:scale-[0.98] touch-manipulation"
              >
                Explore More Places
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Enhanced Recommendations (only visible on desktop) */}
        <div class="hidden w-96 space-y-6 lg:block">
          <div class="sticky top-24 rounded-xl border-[#E6D7C3]/40 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <div class="mb-4">
              <h3 class="text-xl font-semibold text-[#5B3E29]">
                You might also like
              </h3>
              <p class="text-sm text-[#6D5D4E]/70">
                Discover similar places nearby
              </p>
            </div>
            <div class="space-y-4">
              {suggestedPlaces.value?.map((place) => (
                <SuggestedPlaceCard key={place.id} {...place} />
              )) || []}
            </div>

            <div class="pt-6">
              <Link
                href="/places"
                class="block w-full rounded-xl bg-gradient-to-r from-[#D98E73] to-[#C27B62] py-3 text-center font-medium text-white shadow-lg hover:from-[#C27B62] hover:to-[#A6654E]"
              >
                Explore More Places
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const place = resolveValue(useloadPlace);
  return {
    title: `Study & Hack | ${place.data?.Name || "Place Details"}`,
    meta: [
      {
        name: "description",
        content: place.data?.Description || "",
      },
      {
        name: "id",
        content: place.data?.PlaceID.toString() || "",
      },
      {
        property: "og:title",
        content: `Study & Hack | ${place.data?.Name || "Place Details"}`,
      },
      {
        property: "og:description",
        content: place.data?.Description || "",
      },
      {
        property: "og:image",
        content: place.data?.ImageURL || "",
      },
      {
        property: "twitter:card",
        content: "summary_large_image",
      },
      {
        property: "twitter:title",
        content: `Study & Hack | ${place.data?.Name || "Place Details"}`,
      },
      {
        property: "twitter:description",
        content: place.data?.Description || "",
      },
      {
        property: "twitter:image",
        content: place.data?.ImageURL || "",
      },
    ],
  };
};
