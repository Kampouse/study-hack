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
      <div class="space-y-6 overflow-hidden rounded-xl border border-[#E6D7C3] bg-white p-6 shadow-md">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-[#5B3E29]">
            Active Meet Requests
          </h2>
          <div class="h-8 w-8 rounded-full bg-[#F8D7BD] p-1.5">
            <Users class="h-full w-full text-[#D98E73]" />
          </div>
        </div>
        <div class="-mx-3 divide-y divide-[#F8EDE3]">
          {requests.map((req) => (
            <div class="py-3 first:pt-0 last:pb-0" key={req.requestId}>
              <Link
                href={`/profile/meet/request/${req.requestId}`}
                class="group block rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-[#FFF8F0] hover:shadow-sm"
              >
                <div class="flex items-center gap-3">
                  <div class="relative h-12 w-12 overflow-hidden rounded-full shadow-sm transition-transform duration-200 group-hover:scale-105">
                    <img
                      class="h-full w-full object-cover"
                      src={
                        req.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(req.username || "User")}&background=F8D7BD&color=5B3E29`
                      }
                      width={48}
                      height={48}
                      alt={
                        req.username
                          ? `${req.username}'s avatar`
                          : "User avatar"
                      }
                    />
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <h3 class="truncate font-medium text-[#5B3E29] transition-colors group-hover:text-[#D98E73]">
                      {req.eventName || "Event Request"}
                    </h3>
                    {req.username && (
                      <span class="mt-1 flex items-center text-sm text-[#6D5D4E] transition-colors group-hover:text-[#C27B62]">
                        <Users class="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span class="truncate">@{req.username}</span>
                      </span>
                    )}
                  </div>
                  <div class="rounded-full bg-white p-1 shadow-sm transition-all duration-200 group-hover:bg-[#F8D7BD] group-hover:shadow">
                    <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-[#D98E73] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {requests.length > 3 && (
          <Link
            href="/profile/meet/requests"
            class="mt-2 block text-center text-sm font-medium text-[#D98E73] transition-colors hover:text-[#C27B62]"
          >
            View All Requests
          </Link>
        )}
      </div>
    );
  },
);
