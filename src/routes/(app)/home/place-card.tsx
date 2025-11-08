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
        class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
      >
        <div class="relative aspect-[16/10] overflow-hidden">
          <img
            src={props.place.image || "/placeholder.svg"}
            width={400}
            height={250}
            alt={props.place.name}
            class="h-full w-full object-cover"
            loading="lazy"
            onError$={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Rating and Creator Badges - Right side */}
          <div class="absolute right-3 top-3 flex flex-col gap-1.5 sm:right-4 sm:top-4">
            <span class="inline-flex items-center gap-0.5 rounded-full bg-white p-2 text-xs font-medium text-gray-600 shadow-sm">
              <Star class="h-2.5 w-2.5 text-gray-400" />
              <span>{Math.round(props.place.rating * 10) / 10}</span>
            </span>
          </div>

          {/* Creator Badge - Left side */}
          <div class="absolute left-3 top-3 sm:left-4 sm:top-4">
            <span class="inline-flex items-center gap-1 rounded-full bg-white p-2 text-xs font-medium text-gray-600 shadow-sm">
              <Users class="h-2.5 w-2.5 text-gray-400" />
              <span class="max-w-20 truncate"> {props.place.creator}</span>
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div class="flex flex-1 flex-col bg-white p-3 min-h-[100px]">
          <h3 class="line-clamp-1 text-lg font-medium text-gray-900">
            {props.place.name}
          </h3>

          {/* Description */}
          <div class="flex-grow overflow-hidden">
            <p class="line-clamp-5 py-1 px-0 text-sm leading-relaxed text-gray-600 bg-gray-50/50 rounded-lg">
              {props.place.description || "No description provided."}
            </p>
          </div>
        </div>
      </Link>
    );
  }
);
