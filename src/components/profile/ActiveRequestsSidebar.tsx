import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { UsersIcon as Users, ChevronRightIcon } from "lucide-qwik";
import type { ActiveRequestType } from "~/routes/profile/types";

interface ActiveRequestsSidebarProps {
  requests: ActiveRequestType[] | null | undefined; // Allow null/undefined
}

/**
 * Displays a sidebar listing active meet requests. Each request links to its detail page.
 * Shows the event name (or fallback), username, and avatar.
 * Renders nothing if the requests array is null, undefined, or empty.
 *
 * Takes:
 * - `requests`: An array of `ActiveRequestType` objects, or null/undefined.
 *
 * Example Usage:
 * ```tsx
 * const activeRequests = useComputed$(() => data.value?.activeRequest);
 * <ActiveRequestsSidebar requests={activeRequests.value} />
 * ```
 */
export const ActiveRequestsSidebar = component$<ActiveRequestsSidebarProps>(
  ({ requests }) => {
    // Use a more specific type for requests
    if (!requests || requests.length === 0) {
      return null; // Don't render if no active requests
    }

    return (
      // Increased padding for sidebar card
      <div class="space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 class="text-xl font-semibold text-[#5B3E29]">
          Active Meet Requests
        </h2>
        <div class="-mx-4 divide-y divide-[#F8EDE3]">
          {" "}
          {/* Adjusted negative margin */}
          {requests.map((req) => (
            <div class="py-4 first:pt-0 last:pb-0" key={req.requestId}>
              {" "}
              {/* Increased vertical padding */}
              <Link
                href={`/profile/meet/request/${req.requestId}`} // Ensure this route exists
                class="group block rounded-lg px-4 py-3 transition-colors hover:bg-[#FFF8F0]/80" // Adjusted padding
              >
                <div class="flex items-center gap-4">
                  <img
                    class="h-12 w-12 flex-shrink-0 rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
                    src={
                      req.image || // Use request-specific image if available
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(req.username || "User")}&background=F8D7BD&color=5B3E29` // Fallback to generated avatar
                    }
                    width={48}
                    height={48}
                    alt={
                      req.username ? `${req.username}'s avatar` : "User avatar"
                    }
                    // Add onError fallback for generated avatars too if needed
                  />
                  <div class="flex-1 overflow-hidden">
                    <h3 class="truncate font-medium text-[#5B3E29] group-hover:text-[#D98E73]">
                      {req.eventName || "Event Request"}{" "}
                      {/* Provide fallback */}
                    </h3>
                    {req.username && (
                      <span class="mt-1 flex items-center text-sm text-[#6D5D4E] group-hover:text-[#C27B62]">
                        <Users class="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span class="truncate">@{req.username}</span>
                      </span>
                    )}
                  </div>
                  <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#D98E73]" />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Optional: Add a button to view all requests if list is truncated */}
        {/* <Link href="/requests" class="mt-4 block text-center text-sm font-medium text-[#D98E73] hover:text-[#C27B62]">
             View All Requests
           </Link> */}
      </div>
    );
  },
);