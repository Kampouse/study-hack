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
 * - `place`: An object containing place details.
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
      <div
        key={props.place.id}
        class="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E6DA] bg-white transition-all duration-300 ease-in-out"
      >
        <Link href={`/places/${encodeURI(props.place.name)}`}>
          <div class="relative aspect-[16/10] overflow-hidden">
            <img
              src={props.place.image || "/placeholder.svg"}
              width={400}
              height={250}
              alt={props.place.name}
              class="h-full w-full object-cover transition-transform duration-500"
              onError$={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div class="absolute bottom-4 left-4 z-10 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm">
              <MapPin class="mr-1.5 h-4 w-4 text-[#D98E73]" />
              {props.place.location}
            </div>
            <div class="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#5B3E29] shadow-sm backdrop-blur-sm">
              <Star class="h-4 w-4 text-[#D98E73]" />
              <span>{Math.round(props.place.rating * 10) / 10}</span>
            </div>
            <div class="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#D98E73] shadow-sm backdrop-blur-sm">
              {props.place.badge}
            </div>
          </div>
          <div class="flex flex-1 flex-col p-5 md:p-6">
            <div class="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin class="h-4 w-4 flex-shrink-0 text-[#D98E73]" />
              <span class="truncate" title={props.place.location}>
                {props.place.location}
              </span>
            </div>
            <h3 class="mb-2 line-clamp-2 text-xl font-semibold text-[#5B3E29] group-hover:text-[#C27B62]">
              {props.place.name}
            </h3>

            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8D7BD]">
                <Users class="h-3 w-3 text-[#8B5A2B]" />
              </div>
              <span class="text-sm text-[#8B5A2B]">
                By {props.place.creator}
              </span>
            </div>

            <div class="mb-4">
              <p class="line-clamp-2 text-sm text-[#6D5D4E]">
                {props.place.description}
              </p>
            </div>

            <div class="mb-5 flex flex-wrap gap-2">
              {props.place.tags.map((tag: string) => (
                <span
                  key={tag}
                  class="rounded-full bg-[#F8D7BD]/70 px-3 py-1 text-xs font-medium text-[#8B5A2B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>
    );
  }
);