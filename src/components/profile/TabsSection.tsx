import { component$, useSignal } from "@builder.io/qwik";

import type { DetailedEventType, PlaceType } from "~/routes/profile/types";
import { EventCard } from "./EventCard";
import { PlaceCard } from "./PlaceCard";

interface TabsSectionProps {
  upcomingEvents: DetailedEventType[];
  hostedEvents: DetailedEventType[];
  savedPlaces: PlaceType[];
}

/**
 * Renders a tabbed interface to display lists of upcoming events, hosted events,
 * and saved places. Uses `EventCard` and `PlaceCard` for display, and `EmptyState`
 * when a list is empty.
 *
 * Takes:
 * - `upcomingEvents`: An array of `DetailedEventType` objects for events the user is attending.
 * - `hostedEvents`: An array of `DetailedEventType` objects for events the user is hosting.
 * - `savedPlaces`: An array of `PlaceType` objects for places the user has saved.
 *
 * Example Usage:
 * ```tsx
 * const upcoming = useComputed$(() => [ ...eventData... ]);
 * const hosted = useComputed$(() => [ ...eventData... ]);
 * const places = useComputed$(() => [ ...placeData... ]);
 *
 * <TabsSection
 *   upcomingEvents={upcoming.value}
 *   hostedEvents={hosted.value}
 *   savedPlaces={places.value}
 * />
 * ```
 */
export const TabsSection = component$<TabsSectionProps>(
  ({ upcomingEvents, hostedEvents, savedPlaces }) => {
    const activeTab = useSignal("upcoming");

    // Ensure icons match IconComponent type
    const tabs: {
      id: string;
      label: string;
      count: number;
    }[] = [
        {
          id: "upcoming",
          label: "Upcoming",
          count: upcomingEvents.length,
        },
        {
          id: "hosted",
          label: "Hosted",
          count: hostedEvents.length,
        },
        {
          id: "saved",
          label: "Saved Places",
          count: savedPlaces.length,
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
              const tabLabel = tab.label;
              const tabCount = tab.count;

              return (
                <button
                  key={tabId}
                  onClick$={() => (activeTab.value = tabId)} // Use captured primitive value
                  class={`group inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors duration-150 ease-in-out focus:outline-none ${activeTab.value === tabId // Use captured primitive value
                    ? "border-[#D98E73] text-[#C27B62]"
                    : "border-transparent text-[#6D5D4E] hover:border-gray-300 hover:text-[#5B3E29]"
                    }`}
                  aria-current={activeTab.value === tabId ? "page" : undefined} // Use captured primitive value
                >



                  <span>{tabLabel}</span>
                  {tabCount > 0 && (
                    <span
                      class={`ml-2.5 hidden rounded-full px-2.5 py-1 text-xs font-semibold md:inline-block ${activeTab.value === tabId // Use captured primitive value
                        ? "bg-[#FFF1E6] text-[#C27B62]"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        }`}
                    >
                      {tabCount}
                    </span>
                  )}
                </button>
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
              <h1 class="text-2xl font-bold text-center">No joined events</h1>
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
              <h1 class="text-2xl font-bold text-center">No Hosted Events</h1>
            ))}

          {activeTab.value === "saved" &&
            (savedPlaces.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {savedPlaces.map((place) => (
                  <PlaceCard key={place.placeId ?? place.id} place={place} />
                ))}
              </div>
            ) : (
              <h1 class="text-2xl font-bold text-center">No Saved Places</h1>
            ))}
        </div>
      </div>
    );
  },
);
