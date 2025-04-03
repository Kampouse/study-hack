import { component$, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  HeartIcon as Heart,
  MapPinIcon as MapPin,
  StarIcon as Star,
} from "lucide-qwik";
import type { PlaceType } from "~/routes/profile/types";

interface PlaceCardProps {
  place: PlaceType;
}

/**
 * Displays a card for a saved place, showing image, name, location, description,
 * tags, rating, visit count, and a "View Details" button. Includes a like button
 * (currently logs to console).
 *
 * Takes:
 * - `place`: An object conforming to `PlaceType` containing the place details.
 *
 * Example Usage:
 * ```tsx
 * const placeData = { id: 1, name: 'Library Cafe', location: '...', ... };
 * <PlaceCard place={placeData} />
 * ```
 */
export const PlaceCard = component$<PlaceCardProps>(({ place }) => {
  const handleLikeClick = $(() => {
    console.log("Like button clicked for place:", place.id);
    // Implement like/unlike logic here
  });

  return (
    <div class="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E6DA] bg-white  transition-all duration-300 ease-in-out hover:shadow-xl">
      <div class="relative aspect-[16/10] overflow-hidden">
        <img
          src={place.image || "/placeholder-place.svg"}
          width={400}
          height={250}
          alt={`Image for ${place.name}`}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError$={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-place.svg";
          }}
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <button
          onClick$={handleLikeClick}
          class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#D98E73] backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-[#C27B62] active:scale-100"
          aria-label="Save place"
          title="Save place"
        >
          <Heart class="h-5 w-5" />
        </button>
        <div class="absolute bottom-4 left-4 z-10 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm">
          <MapPin class="mr-1.5 h-4 w-4 text-[#D98E73]" />
          {place.visitCount} {place.visitCount === 1 ? "visit" : "visits"}
        </div>
        <div class="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#5B3E29] shadow-sm backdrop-blur-sm">
          <Star class="h-4 w-4 fill-[#D98E73] text-[#D98E73]" />
          {/* Ensure rating is a number before calling toFixed */}
          <span>
            {typeof place.rating === "number" ? place.rating.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
      <div class="flex flex-1 flex-col p-5 md:p-6">
        <div class="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <MapPin class="h-4 w-4 flex-shrink-0 text-[#D98E73]" />
          <span class="truncate" title={place.location}>
            {place.location}
          </span>
        </div>
        <h3 class="mb-2 line-clamp-2 text-xl font-semibold text-[#5B3E29] group-hover:text-[#C27B62]">
          {place.name}
        </h3>
        <p class="mb-4 line-clamp-3 flex-grow text-base text-[#6D5D4E]">
          {place.description}
        </p>
        <div class="mb-5 flex flex-wrap gap-2">
          {place.tags.map((tag: string) => (
            <span
              key={tag}
              class="rounded-full bg-[#F8D7BD]/70 px-3 py-1 text-xs font-medium text-[#8B5A2B]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div class="mt-auto pt-3">
          <Link
            href={`/place/${place.placeId ?? place.id}`}
            class="block w-full rounded-lg bg-[#D98E73] px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
});
