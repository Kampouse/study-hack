import { component$ } from "@qwik.dev/core";
import { routeLoader$, Link } from "@qwik.dev/router";

import * as Icons from "lucide-qwik";

export const useEventDetails = routeLoader$(async () => {
  // Fetch event details based on params.eventId
  // This is a placeholder, replace with actual API call
  return {
    name: "Web Development Enthusiasts Meetup",
    date: "2023-07-15",
    time: "2:00 PM",
    location: "TechHub Coworking Space, 123 Main St, Techville",
  };
});

export default component$(() => {
  const event = useEventDetails();

  return (
    <div class="m-4 mx-auto max-w-2xl overflow-hidden rounded-xl border bg-white p-8 shadow-lg">
      <div class="mb-6 text-center">
        <Icons.CheckCircleIcon class="mx-auto h-16 w-16 text-green-500" />
        <h1 class="mt-4 text-3xl font-bold text-gray-800">Success!</h1>
        <p class="mt-2 text-xl text-gray-600">
          You've successfully joined the event. excited to see you there!
        </p>
      </div>
      <div class="mt-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          {event.value.name}
        </h2>
        <div class="space-y-2">
          <div class="flex items-center">
            <Icons.CalendarIcon class="mr-2 h-5 w-5 text-gray-600" />
            <p class="text-gray-700">
              {event.value.date} at {event.value.time}
            </p>
          </div>
          <div class="flex items-center">
            <Icons.MapPinIcon class="mr-2 h-5 w-5 text-gray-600" />
            <p class="text-gray-700">{event.value.location}</p>
          </div>
        </div>
      </div>
      <Link
        href="/home"
        class="mt-8 block w-full cursor-pointer rounded bg-blue-500 px-4 py-2 text-lg font-semibold text-white hover:bg-blue-700"
      >
        Back to Events
      </Link>
    </div>
  );
});
