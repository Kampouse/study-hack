import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { EventCard } from "@/components/app/eventCard/EventCard";
import { QueryEvents } from "~/api/Query";
import type { DocumentHead } from "@builder.io/qwik-city";

export const useEvents = routeLoader$(async (event) => {
  // This is a placeholder. Replace with actual API call to fetch events
  try {
    const data = await QueryEvents({
      event: event,
      options: {
        limit: 10,
      },
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
      <div class="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.value?.map((event) => (
          <EventCard
            key={event.eventID}
            title={event.name}
            description={event.description}
            time={event.date}
            tags={event.tags}
            attendees={0}
            link={"/join/" + event.eventID}
          />
        ))}
      </div>
    </div>
  );
});
