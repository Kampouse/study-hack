import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getPlace, getPlaces } from "~/api/EndPoint";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  StarIcon,
  MapPinIcon,
  MessageSquareIcon,
  HeartIcon,
  UsersIcon,
} from "lucide-qwik";

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
        href={`/places/${props.name}`}
        class="group block cursor-pointer overflow-hidden rounded-xl border border-[#E6D7C3]/30 bg-white/80 transition-all duration-300 hover:bg-white hover:shadow-md"
      >
        <div class="relative">
          <div class="relative h-32 w-full overflow-hidden">
            <img
              src={props.image}
              alt={props.name}
              class="h-full w-full object-cover transition-transform"
              width={300}
              height={128}
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div class="absolute left-3 top-3">
            <span class="inline-block rounded-full bg-white/95 px-2 py-1 text-xs font-medium text-[#8B5A2B]">
              {category}
            </span>
          </div>

          <div class="absolute right-3 top-3 flex gap-2">
            <button class="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 p-0 hover:bg-white">
              <HeartIcon class="h-4 w-4 text-[#D98E73]" />
            </button>
          </div>

          <div class="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1">
            <StarIcon class="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span class="text-xs font-semibold text-[#5B3E29]">
              {props.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div class="p-4">
          <div class="space-y-3">
            <div>
              <h4 class="truncate font-semibold text-[#5B3E29]">
                {props.name}
              </h4>
              <p class="truncate text-sm text-[#6D5D4E]/70">
                {props.description.substring(0, 40)}...
              </p>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-1 text-[#6D5D4E]/70">
                <MapPinIcon class="h-3 w-3" />
                <span>{distance}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium text-[#5B3E29]">{price}</span>
                <div
                  class={`h-2 w-2 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`}
                />
              </div>
            </div>

            <div class="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  class="inline-block rounded-full bg-[#F8D7BD]/80 px-2 py-0.5 text-xs text-[#8B5A2B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  },
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
      <div class="flex flex-col gap-4 rounded-xl border border-[#E6D7C3]/50 bg-[#F8EDE3]/30 p-4 sm:flex-row">
        <div class="flex-shrink-0">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#D98E73] to-[#C27B62] font-semibold text-white ring-2 ring-[#F8D7BD]">
            {props.initials}
          </div>
        </div>
        <div class="flex-1">
          <div class="mb-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <h3 class="font-semibold text-[#5B3E29]">{props.name}</h3>
            <p class="text-xs text-[#6D5D4E]/70">{props.timeAgo}</p>
          </div>
          <div class="mb-3 flex items-center gap-2">
            <div class="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  class={`h-4 w-4 ${star <= props.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span class="text-sm font-medium text-[#5B3E29]">
              {props.rating}.0
            </span>
          </div>
          <p class="mb-3 text-[#6D5D4E]/80">{props.comment}</p>
          <div class="flex items-center gap-4 text-sm text-[#6D5D4E]/70">
            <button class="transition-colors hover:text-[#8B5A2B]">
              👍 Helpful ({props.helpful || 0})
            </button>
            <button class="transition-colors hover:text-[#8B5A2B]">
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export const useloadPlace = routeLoader$(async (context) => {
  const output = decodeURIComponent(context.params.name);
  // Check if the output is a valid number
  const id = parseInt(output, 10);
  const isId = !isNaN(id);

  // Query getPlace with id when output is a number, otherwise use placeName
  const data = await getPlace({
    event: context,
    placeName: isId ? undefined : output,
    id: isId ? id : undefined,
  });

  return { ...data };
});

export const useLoadSuggestedPlaces = routeLoader$(async (context) => {
  const currentPlace = await getPlace({
    event: context,
    placeName: context.params.name,
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

      <div class=" mx-auto flex max-w-7xl flex-col px-4 py-4 pt-32 lg:flex-row lg:gap-6 lg:p-6">
        {/* Main Content */}
        <div class="flex-1 space-y-6">
          {/* Hero Section */}
          <div class="overflow-hidden rounded-xl border-[#E6D7C3]/40 bg-white/90 shadow-xl backdrop-blur-sm">
            <div class="relative">
              <img
                src={(place.value.data?.ImageURL as string) || ""}
                alt={place.value.data?.Name}
                class="h-[250px] w-full object-cover sm:h-[350px] md:h-[450px]"
                width={824}
                height={450}
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Overlay Content */}
              <div class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div class="flex items-end justify-between">
                  <div class="rounded-xl bg-black/20 px-3 py-2 text-white backdrop-blur-sm sm:px-6 sm:py-4">
                    <h2 class="mb-1 text-xl font-bold sm:mb-2 sm:text-2xl">
                      {place.value.data?.Name}
                    </h2>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            class={`h-4 w-4 sm:h-5 sm:w-5 ${
                              star <= (place.value.data?.Rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span class="text-xs font-medium sm:text-sm">
                        {place.value.data?.Rating?.toFixed(1) || "0.0"} (127
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Event Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#D98E73]">
                <UsersIcon class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="mb-1 text-lg font-semibold text-[#5B3E29]">
                  {place.value.data?.Name}
                </h3>
                <p class="text-sm text-[#6D5D4E]/70">
                  Create your own event and connect with like-minded people
                </p>
              </div>
              <Link
                href={`/new?placeId=${place.value.data?.PlaceID}`}
                class="mt-2 w-full rounded-lg bg-[#D98E73] px-6 py-2 text-center text-white hover:bg-[#C27B62] sm:mt-0 sm:w-auto"
              >
                Create Event Here
              </Link>
            </div>
          </div>

          {/* Location & Info Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            {/* Description Section with improved spacing */}
            <div class="mb-6">
              <h3 class="mb-3 text-lg font-semibold text-[#5B3E29] md:text-xl">
                About this place
              </h3>
              <p class="leading-relaxed text-[#6D5D4E]/80 md:text-base">
                {place.value.data?.Description}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span class="inline-block rounded-full border border-[#E6D7C3] px-3 py-1 text-xs font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD]/20 sm:text-sm">
                  High-speed WiFi
                </span>
                <span class="inline-block rounded-full border border-[#E6D7C3] px-3 py-1 text-xs font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD]/20 sm:text-sm">
                  Meeting rooms
                </span>
                <span class="inline-block rounded-full border border-[#E6D7C3] px-3 py-1 text-xs font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD]/20 sm:text-sm">
                  Coffee station
                </span>
                <span class="inline-block rounded-full border border-[#E6D7C3] px-3 py-1 text-xs font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD]/20 sm:text-sm">
                  Quiet environment
                </span>
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
                  <div class="flex items-center gap-2">
                    <div class="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span class="text-sm font-medium text-green-700">Open</span>
                  </div>
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
                        {place.value.data?.Rating?.toFixed(1) || "0.0"}
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
                  <div class="mt-2 flex justify-between gap-3">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(place.value.data?.Address || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D98E73] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#C27B62]"
                    >
                      <MapPinIcon class="h-4 w-4" />
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:p-6">
            <div class="mb-4">
              <div class="flex items-center justify-between">
                <h2 class="flex items-center gap-2 text-lg font-semibold text-[#5B3E29] sm:text-xl">
                  <MessageSquareIcon class="h-5 w-5" />
                  Reviews & Comments
                </h2>
                <span class="inline-block rounded-full bg-[#F8D7BD] px-2 py-0.5 text-sm text-[#8B5A2B]">
                  {reviewsData.length} reviews
                </span>
              </div>
            </div>
            <div class="space-y-6">
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
            <div class="grid gap-4 sm:grid-cols-2">
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
