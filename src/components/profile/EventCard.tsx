import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import JustRnD from "../../assets/just-rnd.png?url";
import {
  CalendarIcon as Calendar,
  MapPinIcon as MapPin,
  UsersIcon as Users,
  UserPlusIcon as UserPlus,
  CheckCircleIcon as CheckCircle,
  Clock3Icon as Clock3,
  InfoIcon,
} from "lucide-qwik";
// IconComponent type is removed as it's no longer needed here
import type { DetailedEventType } from "~/routes/profile/types";

interface EventCardProps {
  event: DetailedEventType;
  isHosted?: boolean;
}

export const EventCard = component$<EventCardProps>(
  ({ event, isHosted = false }) => {
    const status = isHosted ? "Host" : event.role || event.status || "Pending";

    // Add error handling for date parsing
    let displayDate = "Invalid Date";
    let displayTime = "";
    try {
      const dateTime = new Date(event.date);
      if (!isNaN(dateTime.getTime())) {
        displayDate = dateTime.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        displayTime = dateTime.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    } catch (e) {
      console.error("Failed to parse event date:", event.date, e);
    }

    const statusStyles: Record<string, string> = {
      Host: "bg-[#E6F2FF] text-[#5B8CB7]",
      Confirmed: "bg-[#E8F4EA] text-[#6A9B7E]",
      Pending: "bg-[#FFF1E6] text-[#D98E73]",
      Default: "bg-gray-100 text-gray-600", // Keep default style for potential other statuses
    };
    // Determine style, falling back to default if status isn't explicitly handled
    const currentStatusStyle = statusStyles[status] || statusStyles.Default;

    return (
      <div class="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E6DA] bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <div class="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.image || JustRnD}
            width={400}
            height={250}
            alt={`Image for ${event.name}`}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError$={(e) => {
              (e.target as HTMLImageElement).src = JustRnD;
            }}
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {event.location && (
            <div class="absolute left-4 top-4 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm">
              <MapPin class="mr-1.5 h-4 w-4 text-[#D98E73]" />
              <span class="truncate">{event.location}</span>
            </div>
          )}

          <div class="absolute right-4 top-4">
            <span
              class={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${currentStatusStyle}`}
            >
              {/* Conditional rendering for icons based on status */}
              {status === "Host" && <UserPlus class="mr-1 h-4 w-4" />}
              {status === "Confirmed" && <CheckCircle class="mr-1 h-4 w-4" />}
              {status === "Pending" && <Clock3 class="mr-1 h-4 w-4" />}
              {/* Default/fallback icon for any other status */}
              {status !== "Host" &&
                status !== "Confirmed" &&
                status !== "Pending" && <InfoIcon class="mr-1 h-4 w-4" />}
              {status}
            </span>
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 class="mb-1.5 line-clamp-2 text-xl font-semibold group-hover:text-[#F8D7BD]">
              {event.name}
            </h3>
            <div class="flex items-center justify-between text-sm opacity-90">
              <div class="flex items-center gap-1.5">
                <Calendar class="h-4 w-4" />
                <span>
                  {displayDate} {displayTime ? `at ${displayTime}` : ""}
                </span>
              </div>
              {typeof event.attendees === "number" && event.attendees > 0 && (
                <div class="flex items-center gap-1">
                  <Users class="h-4 w-4" />
                  <span>{event.attendees}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div class="flex flex-1 flex-col p-5 md:p-6">
          <p class="mb-5 line-clamp-3 flex-grow text-base text-[#6D5D4E]">
            {event.description || "No description provided."}
          </p>
          <div class="mt-auto flex items-center justify-start gap-3 pt-3">
            {isHosted ? (
              <>
                <Link
                  href={`/event/edit/${event.eventID ?? event.id}`}
                  class="flex-1 whitespace-nowrap rounded-lg border border-[#D98E73]/70 px-4 py-2 text-center text-sm font-medium text-[#D98E73] transition-colors hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Edit
                </Link>
                <Link
                  href={`/event/manage/${event.eventID ?? event.id}`}
                  class="flex-1 whitespace-nowrap rounded-lg bg-[#D98E73] px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Manage
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/details/${event.eventID ?? event.id}`}
                  class="rounded-lg bg-[#D98E73] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Details
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);
