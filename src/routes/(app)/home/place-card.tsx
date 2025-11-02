import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  MapPinIcon as MapPin,
  StarIcon as Star,
  UsersIcon as Users,
} from "lucide-qwik";

/**
 * Displays a card for a place, showing image, name, type, location,
 * description, tags, creator, rating, and tags.
 *
 * Takes:
 * - `place`: An object containing the place details.
 *
 * Example Usage:
 * ```tsx
 * const placeData = { id: 1, name: 'Coffee Shop', image: '...', ... };
 * <PlaceCard place={placeData} />
 * ```
 */
export const PlaceCard = component$(
  (props: {
    place: {
      id: number;
      name: string;
      image: string;
      badge: string;
      location: string;
      description: string;
      tags: string[];
      creator: string;
      rating: number;
    };
  }) => {
    return (
      <Link
        href={`/places/${encodeURI(props.place.name)}`}
        class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-md transition-all duration-300 ease-in-out"
      >
        <div class="relative aspect-[16/10] overflow-hidden">
          <img
            src={props.place.image || "/placeholder.svg"}
            width={400}
            height={250}
            alt={props.place.name}
            class="h-full w-full object-cover transition-transform duration-500"
            loading="lazy"
            onError$={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Rating Badge - Right side to match EventCard status position */}
          <div class="absolute right-3 top-3 sm:right-4 sm:top-4">
            <span class="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#5B3E29] shadow-sm backdrop-blur-sm">
              <Star class="h-3.5 w-3.5 text-[#D98E73]" />
              <span>{Math.round(props.place.rating * 10) / 10}</span>
            </span>
          </div>

          {/* Badge - Left side */}
          {props.place.badge && (
            <div class="absolute left-3 top-3 sm:left-4 sm:top-4">
              <span class="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#D98E73] shadow-sm backdrop-blur-sm">
                {props.place.badge}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div class="flex flex-1 flex-col bg-white p-3 sm:p-4 md:p-6">
          <h3 class="mb-2 line-clamp-2 text-base font-semibold leading-tight text-[#5B3E29] transition-colors duration-300 group-hover:text-[#C27B62] sm:text-lg md:text-xl">
            {props.place.name}
          </h3>

          {/* Creator and Location info - Stack on mobile, inline on larger screens */}
          <div class="mb-3 flex flex-col gap-1.5 text-xs sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-3 sm:gap-y-1 sm:text-sm">
            {/* Creator */}
            <div class="flex items-center gap-1.5 text-[#8B5A2B]">
              <div class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F8D7BD] sm:h-4 sm:w-4">
                <Users class="h-2 w-2 text-[#8B5A2B] sm:h-2.5 sm:w-2.5" />
              </div>
              <span class="whitespace-nowrap">By {props.place.creator}</span>
            </div>

            {/* Separator - hidden on mobile, shown on larger screens */}
            <span class="hidden text-gray-300 sm:inline">•</span>

            {/* Location - can wrap to multiple lines */}
            <div class="flex flex-1 items-start gap-1.5 text-gray-500">
              <MapPin class="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#D98E73] sm:h-4 sm:w-4" />
              <span
                class="break-words leading-snug"
                title={props.place.location}
              >
                {props.place.location}
              </span>
            </div>
          </div>

          {/* Description */}
          <p class="mb-3 line-clamp-2 flex-grow rounded-md bg-gray-50/50 p-2 text-xs leading-relaxed text-gray-600 sm:mb-4 sm:line-clamp-3 sm:text-sm md:line-clamp-4 md:text-base">
            {props.place.description || "No description provided."}
          </p>

          {/* Tags - Show fewer on mobile */}
          <div class="flex flex-wrap gap-1.5 sm:gap-2">
            {props.place.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                class="rounded-full bg-[#F8D7BD]/70 px-2.5 py-0.5 text-xs font-medium leading-tight text-[#8B5A2B] sm:px-3 sm:py-1"
              >
                {tag}
              </span>
            ))}
            {props.place.tags.length > 3 && (
              <span class="rounded-full bg-[#F8D7BD]/50 px-2.5 py-0.5 text-xs font-medium leading-tight text-[#8B5A2B] sm:px-3 sm:py-1">
                +{props.place.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }
);
