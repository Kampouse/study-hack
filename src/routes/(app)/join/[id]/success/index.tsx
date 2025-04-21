import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";

import {
  CheckCircleIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-qwik";

export const useEventDetails = routeLoader$(async () => {
  // Fetch event details based on params.eventId
  // This is a placeholder, replace with actual API call
  return {
    name: "Web Development Enthusiasts Meetup",
    date: "2023-07-15",
    time: "2:00 PM",
    location: "TechHub Coworking Space, 123 Main St, Techville",
    attendees: 8,
  };
});

export default component$(() => {
  const event = useEventDetails();

  return (
    <div class="min-h-screen bg-[#FFF8F0] py-12">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-2xl overflow-hidden rounded-xl border border-[#E6D7C3] bg-white p-8 shadow-md">
          <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8D7BD]">
              <CheckCircleIcon class="h-10 w-10 text-[#D98E73]" />
            </div>
            <h1 class="text-3xl font-bold text-[#5B3E29]">Success!</h1>
            <p class="mt-3 text-lg text-[#6D5D4E]">
              You've successfully joined the event. Excited to see you there!
            </p>
          </div>

          <div class="rounded-xl bg-[#F8EDE3] p-6">
            <h2 class="mb-4 text-xl font-semibold text-[#5B3E29]">
              {event.value.name}
            </h2>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8D7BD]">
                  <CalendarIcon class="h-5 w-5 text-[#D98E73]" />
                </div>
                <div>
                  <p class="text-sm text-[#8B5A2B]">Date & Time</p>
                  <p class="font-medium text-[#5B3E29]">
                    {event.value.date} at {event.value.time}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8D7BD]">
                  <MapPinIcon class="h-5 w-5 text-[#D98E73]" />
                </div>
                <div>
                  <p class="text-sm text-[#8B5A2B]">Location</p>
                  <p class="font-medium text-[#5B3E29]">
                    {event.value.location}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8D7BD]">
                  <UsersIcon class="h-5 w-5 text-[#D98E73]" />
                </div>
                <div>
                  <p class="text-sm text-[#8B5A2B]">Attendees</p>
                  <div class="flex items-center gap-2">
                    <div class="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F8D7BD] text-xs font-medium text-[#8B5A2B]"
                        >
                          {i}
                        </div>
                      ))}
                      <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E6F2FF] text-xs font-medium text-[#5B8CB7]">
                        +{event.value.attendees - 3}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex gap-4">
            <Link
              href="/home"
              class="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Back to Home
            </Link>

            <Link
              href="/calendar"
              class="inline-flex h-10 w-full items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Add to Calendar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
