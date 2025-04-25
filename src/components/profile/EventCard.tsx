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
import type { DetailedEventType } from "~/routes/profile/types";

interface EventCardProps {
  event: DetailedEventType;
  isHosted?: boolean;
}
const formatEventDate = (dateString: string) => {
  try {
    // Parse the date string "3/31/2025 at 8:00 AM" format
    const dateTimeParts = dateString.split(" at ");
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1];

    // Create a valid date object
    const dateObj = new Date(datePart);

    // Round time to nearest 15-minute interval (00, 15, 30, 45)
    let roundedTimePart = timePart;
    if (timePart) {
      const timeMatch = timePart.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        const hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3].toUpperCase();

        // Round minutes to nearest 15
        const roundedMinutes = Math.ceil(minute / 15) * 15;
        let adjustedHour = hour;
        let adjustedAmPm = ampm;

        // Handle case where minutes round to 60
        if (roundedMinutes === 60) {
          adjustedHour = hour + 1;
          // Handle noon/midnight transitions
          if (adjustedHour === 12 && ampm === "AM") {
            adjustedAmPm = "PM";
          } else if (adjustedHour === 12 && ampm === "PM") {
            adjustedAmPm = "AM";
          } else if (adjustedHour > 12) {
            adjustedHour = 1;
          }
        }

        roundedTimePart = `${adjustedHour}:${roundedMinutes === 60 ? "00" : roundedMinutes.toString().padStart(2, "0")} ${adjustedAmPm}`;
      }
    }

    // Format the date and time for display
    return {
      displayDate: dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      displayTime: roundedTimePart || "",
    };
  } catch (e) {
    console.error("Error parsing date:", e);
    return { displayDate: "", displayTime: "" };
  }
};

export const EventCard = component$<EventCardProps>(
  ({ event, isHosted = false }) => {
    const status = isHosted ? "Host" : event.role || event.status || "Pending";

    // Use the improved date formatting function
    const { displayDate, displayTime } = formatEventDate(event.date);
    console.log(displayDate, displayTime);
    // Status styles remain the same
    const statusStyles: Record<string, string> = {
      Host: "bg-[#E6F2FF] text-[#5B8CB7]",
      Confirmed: "bg-[#E8F4EA] text-[#6A9B7E]",
      Pending: "bg-[#FFF1E6] text-[#D98E73]",
      Default: "bg-gray-100 text-gray-600",
    };
    const currentStatusStyle = statusStyles[status] || statusStyles.Default;

    return (
      // Added h-full for flex/grid consistency, adjusted shadow and border slightly
      <div class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg">
        {/* Image Section */}
        <div class="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.image || JustRnD}
            width={400} // Keep explicit dimensions for performance
            height={250}
            alt={`Image for ${event.name}`}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy" // Added lazy loading
            onError$={(e) => {
              (e.target as HTMLImageElement).src = JustRnD;
            }}
          />
          {/* Adjusted gradient for potentially better text visibility */}
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Location Badge - Adjusted padding, position, max-width */}
          {event.location && (
            <div class="absolute left-3 top-3 flex max-w-[calc(100%-6rem)] items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm sm:left-4 sm:top-4">
              <MapPin class="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-[#D98E73]" />
              <span class="truncate">{event.location}</span>
            </div>
          )}

          {/* Status Badge - Adjusted padding */}
          <div class="absolute right-3 top-3 sm:right-4 sm:top-4">
            <span
              class={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${currentStatusStyle}`} // Adjusted padding slightly
            >
              {/* Increased icon margin */}
              {status === "Host" && <UserPlus class="mr-1.5 h-3.5 w-3.5" />}
              {status === "Confirmed" && (
                <CheckCircle class="mr-1.5 h-3.5 w-3.5" />
              )}
              {status === "Pending" && <Clock3 class="mr-1.5 h-3.5 w-3.5" />}
              {status !== "Host" &&
                status !== "Confirmed" &&
                status !== "Pending" && <InfoIcon class="mr-1.5 h-3.5 w-3.5" />}
              {status}
            </span>
          </div>

          {/* Text Overlay on Image - Adjusted padding, font sizes, layout */}
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5">
            <h3 class="mb-2 line-clamp-2 text-lg font-semibold leading-tight transition-colors duration-300 group-hover:text-[#F8D7BD] sm:text-xl">
              {event.name}
            </h3>
            {/* Stack date/attendees vertically on small screens */}
            <div class="flex flex-col gap-1 text-xs opacity-95 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-sm">
              <div class="flex items-center gap-1.5">
                <Calendar class="h-4 w-4 flex-shrink-0" />{" "}
                {/* Prevent icon shrinking */}
                <span>
                  {displayDate} {displayTime ? `- ${displayTime}` : ""}
                </span>
              </div>
              {typeof event.attendees === "number" && event.attendees > 0 && (
                <div class="flex items-center gap-1">
                  <Users class="h-4 w-4 flex-shrink-0" />{" "}
                  {/* Prevent icon shrinking */}
                  {/* Added context "Attendees" */}
                  <span>
                    {event.attendees} Attendee{event.attendees !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - Adjusted padding, text size, line height, spacing */}
        <div class="flex flex-1 flex-col bg-stone-100/25 p-4 sm:p-5 md:p-6">
          {" "}
          {/* Added subtle background for content area */}
          <p class="mb-5 line-clamp-3 flex-grow rounded-lg border-stone-200/25 bg-stone-200/10 px-2 text-sm leading-relaxed text-gray-600 sm:line-clamp-4 sm:text-base">
            {/* Consistent padding for readability, adjusted text color, line height, line clamp */}
            {event.description || "No description provided."}
          </p>
          {/* Button Area - Responsive layout (stack vertically on small screens) */}
          <div class="mt-auto flex flex-col items-stretch justify-start gap-3 pt-4 sm:flex-row sm:items-center">
            {isHosted ? (
              <>
                <Link
                  href={`/event/edit/${event.eventID ?? event.id}`}
                  // Full width on mobile, auto width on sm+ but takes available space
                  class="w-full whitespace-nowrap rounded-lg border border-[#D98E73]/70 px-4 py-2.5 text-center text-sm font-medium text-[#D98E73] transition-colors duration-200 hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/50 focus:ring-offset-2 sm:flex-1" // Adjusted padding, focus ring
                >
                  Edit
                </Link>
                <Link
                  href={`/event/manage/${event.eventID ?? event.id}`}
                  // Full width on mobile, auto width on sm+ but takes available space
                  class="w-full whitespace-nowrap rounded-lg bg-[#D98E73] px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/50 focus:ring-offset-2 sm:flex-1" // Adjusted padding, focus ring
                >
                  Manage
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/details/${event.eventID ?? event.id}`}
                  // Keep button left-aligned, adjust padding
                  class="self-start rounded-lg bg-[#D98E73] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/50 focus:ring-offset-2" // Adjusted padding, focus ring
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
