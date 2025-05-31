import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  CalendarIcon as Calendar,
  MapPinIcon as MapPin,
  UsersIcon as Users,
} from "lucide-qwik";

/**
 * Displays a card for an event, showing image, title, type, date, time,
 * location, creator, attendees, and a "Join" button.
 *
 * Takes:
 * - `event`: An object containing the event details.
 *
 * Example Usage:
 * ```tsx
 * const eventData = { id: 1, title: 'Study Group', image: '...', ... };
 * <EventCard event={eventData} />
 * ```
 */
export const EventCard = component$(
  (props: {
    event: {
      id: number;
      title: string;
      image: string;
      badge: string;
      type: string;
      date: string;
      time: string;
      location: string;
      creator: string;
      attendees: number;
      spotsLeft: number;
    };
  }) => {
    return (
      <div
        key={props.event.id}
        class="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E6DA] bg-white transition-all duration-300 ease-in-out "
      >
        <Link href={`/details/${props.event.id}`}>
          <div class="relative aspect-[16/10] overflow-hidden">
            <img
              src={props.event.image || "/placeholder.svg"}
              width={400}
              height={250}
              alt={props.event.title}
              class="h-full w-full object-cover transition-transform duration-500"
              onError$={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div class="absolute bottom-4 left-4 z-10 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm">
              <Calendar class="mr-1.5 h-4 w-4 text-[#D98E73]" />
              {props.event.date}
            </div>
            <div class="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#5B3E29] shadow-sm backdrop-blur-sm">
              <Users class="h-4 w-4 text-[#D98E73]" />
              <span>{props.event.spotsLeft} spots left</span>
            </div>
            <div class="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#D98E73] shadow-sm backdrop-blur-sm">
              {props.event.badge}
            </div>
          </div>
          <div class="flex flex-1 flex-col p-5 md:p-6">
            <div class="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin class="h-4 w-4 flex-shrink-0 text-[#D98E73]" />
              <span class="truncate" title={props.event.location}>
                {props.event.location}
              </span>
            </div>
            <h3 class="mb-2 line-clamp-2 text-xl font-semibold text-[#5B3E29] group-hover:text-[#C27B62]">
              {props.event.title}
            </h3>

            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8D7BD]">
                <Users class="h-3 w-3 text-[#8B5A2B]" />
              </div>
              <span class="text-sm text-[#8B5A2B]">
                By {props.event.creator}
              </span>
            </div>

            <div class="mb-5">
              <span class="rounded-full bg-[#F8D7BD]/70 px-3 py-1 text-xs font-medium text-[#8B5A2B]">
                {props.event.type}
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  },
);
