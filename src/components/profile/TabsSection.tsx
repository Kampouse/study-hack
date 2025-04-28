import { component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  CalendarIcon as Calendar,
  UserPlusIcon as UserPlus,
  BellIcon as Bell,
  ClockIcon as Clock,
  BookmarkIcon as Bookmark,
} from "lucide-qwik";
import type {
  DetailedEventType,
  PlaceType,
  ActiveRequestType,
} from "~/routes/profile/types";
import { EventCard } from "./EventCard";
import { PlaceCard } from "./PlaceCard";
import { EmptyState } from "./EmptyState";

interface TabsSectionProps {
  upcomingEvents: DetailedEventType[];
  hostedEvents: DetailedEventType[];
  pastEvents: DetailedEventType[];
  savedPlaces: PlaceType[];
  likedPlaces: PlaceType[];
  requests?: ActiveRequestType[];
}

/**
 * Renders a tabbed interface to display lists of upcoming events, hosted events,
 * past events, saved places, liked places, and requests. Uses `EventCard` and `PlaceCard` for display, and `EmptyState`
 * when a list is empty.
 *
 * Takes:
 * - `upcomingEvents`: An array of `DetailedEventType` objects for events the user is attending.
 * - `hostedEvents`: An array of `DetailedEventType` objects for events the user is hosting.
 * - `pastEvents`: An array of `DetailedEventType` objects for events the user has attended in the past.
 * - `savedPlaces`: An array of `PlaceType` objects for places the user has saved.
 * - `likedPlaces`: An array of `PlaceType` objects for places the user has liked.
 * - `requests`: An array of `ActiveRequestType` objects for pending requests.
 *
 * Example Usage:
 * ```tsx
 * const upcoming = useComputed$(() => [ ...eventData... ]);
 * const hosted = useComputed$(() => [ ...eventData... ]);
 * const past = useComputed$(() => [ ...pastEventData... ]);
 * const savedPlaces = useComputed$(() => [ ...placeData... ]);
 * const likedPlaces = useComputed$(() => [ ...likedPlaceData... ]);
 *
 * <TabsSection
 *   upcomingEvents={upcoming.value}
 *   hostedEvents={hosted.value}
 *   pastEvents={past.value}
 *   savedPlaces={savedPlaces.value}
 *   likedPlaces={likedPlaces.value}
 *   requests={activeRequests}
 * />
 * ```
 */
export const TabsSection = component$<TabsSectionProps>(
  ({
    upcomingEvents,
    hostedEvents,
    pastEvents,
    likedPlaces,
    requests = [],
  }) => {
    const loc = useLocation();

    const tab = loc.url.searchParams.get("tab") ?? "upcoming";
    const activeTab = useSignal(tab);

    // Ensure icons match IconComponent type
    const tabs: {
      id: string;
      label: string;
      icon: any;
      count: number;
    }[] = [
      {
        id: "upcoming",
        label: "Upcoming",
        icon: Calendar,
        count: upcomingEvents.length,
      },
      {
        id: "hosted",
        label: "Hosted",
        icon: UserPlus,
        count: hostedEvents.length,
      },
      {
        id: "requests",
        label: "Requests",
        icon: Bell,
        count: requests.length,
      },

      {
        id: "liked",
        label: "Liked Places",
        icon: Bookmark,
        count: likedPlaces.length,
      },
      {
        id: "past",
        label: "Past Events",
        icon: Clock,
        count: pastEvents.length,
      },
    ];

    return (
      <div class="w-full">
        <div class="mb-8 border-b border-[#F8EDE3]">
          <nav
            class="justify-left -mb-px flex space-x-8 overflow-x-auto px-4 pb-1"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              // Capture serializable values and component reference outside the JSX scope
              // to avoid potential serialization issues with the entire 'tab' object in onClick$.
              const tabId = tab.id;
              const TabIcon = tab.icon;
              const tabLabel = tab.label;
              const tabCount = tab.count;

              return (
                <Link
                  href={"/profile?tab=" + tabId}
                  key={tabId}
                  onClick$={() => (activeTab.value = tabId)} // Use captured primitive value
                  class={`group inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
                    activeTab.value === tabId // Use captured primitive value
                      ? "border-[#D98E73] text-[#C27B62]"
                      : "border-transparent text-[#6D5D4E] hover:border-gray-300 hover:text-[#5B3E29]"
                  }`}
                  aria-current={activeTab.value === tabId ? "page" : undefined} // Use captured primitive value
                >
                  <TabIcon // Render the component directly
                    class={`mr-2 h-5 w-5 ${
                      activeTab.value === tabId // Use captured primitive value
                        ? "text-[#D98E73]"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{tabLabel}</span>
                  {tabCount > 0 && (
                    <span
                      class={`ml-2.5 hidden rounded-full px-2.5 py-1 text-xs font-semibold md:inline-block ${
                        activeTab.value === tabId // Use captured primitive value
                          ? "bg-[#FFF1E6] text-[#C27B62]"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {tabCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div class=" max-w-screen-xl px-4">
          {activeTab.value === "upcoming" &&
            (upcomingEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.eventID ?? event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="CalendarIcon" // Use context instead of icon
                title="No Upcoming Events"
                message="You haven't joined or been invited to any events yet. Explore events to join!"
              />
            ))}

          {activeTab.value === "hosted" &&
            (hostedEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {hostedEvents.map((event) => (
                  <EventCard
                    key={event.eventID ?? event.id}
                    event={event}
                    isHosted
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                context="UsersIcon" // Use context instead of icon (UserPlus mapped to UsersIcon context)
                title="No Hosted Events Yet"
                message="Ready to gather some folks? Host your first event and bring people together."
                actionButton={{ label: "Host an Event", href: "/create-event" }}
              />
            ))}

          {activeTab.value === "past" &&
            (pastEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard key={event.eventID ?? event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="CalendarIcon"
                title="No Past Events"
                message="You haven't attended any events yet. Join some events to build your history!"
                actionButton={{ label: "Find Events", href: "/events" }}
              />
            ))}
          {activeTab.value === "requests" &&
            (requests.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div>
            ) : (
              <EmptyState
                context="BellIcon" // Use Bell icon context for requests
                title="No Pending Requests"
                message="You don't have any pending requests at the moment."
              />
            ))}

          {activeTab.value === "liked" &&
            (likedPlaces.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {likedPlaces.map((place) => (
                  <PlaceCard key={place.placeId ?? place.id} place={place} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="MapPinIcon"
                title="No Liked Places"
                message="You haven't liked any places yet. Browse places and click the heart icon to add them here."
                actionButton={{ label: "Discover Places", href: "/places" }}
              />
            ))}
        </div>
      </div>
    );
  },
);
