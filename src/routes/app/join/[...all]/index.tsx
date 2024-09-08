import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { EventCard } from "@/components/app/eventCard";
import { QueryEvents } from "~/helpers/query";
import type { DocumentHead } from "@builder.io/qwik-city";

export const useEvents = routeLoader$(async (event) => {
  // This is a placeholder. Replace with actual API call to fetch events
  try {
    const data = await QueryEvents(event, {
      limit: 10,
    });
    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
});
export const head: DocumentHead = {
  title: "Events",
};

export default component$(() => {
  const events = useEvents();

  return (
    <div>
      <div class=" flex items-center justify-between">
        <h1 class="py-4 text-3xl font-bold text-gray-800">Upcoming Events</h1>
      </div>{" "}
      <div>
        {events.value?.map((event) => (
          <EventCard key={event.eventID} eventId={event.eventID} data={event} />
        ))}
      </div>
    </div>
  );
});
