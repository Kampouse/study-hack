import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { EventCard } from "@/components/app/eventCard";
import * as Icons from "lucide-qwik";

export const useEvents = routeLoader$(async () => {
  // This is a placeholder. Replace with actual API call to fetch events
  return [
    {
      name: "Web Development Enthusiasts Meetup",
      description:
        "Join us for an exciting meetup focused on web development technologies and best practices.",
      tags: ["web development", "frontend", "backend"],
      starttime: "2023-07-15T14:00:00",
      endttime: "2023-07-15T16:00:00",
      eventId: 1,
    },
    {
      name: "AI and Machine Learning Workshop",
      description:
        "Learn about the latest advancements in AI and machine learning in this hands-on workshop.",
      tags: ["AI", "machine learning", "data science"],
      starttime: "2023-07-20T10:00:00",
      endttime: "2023-07-20T15:00:00",
      eventId: 2,
    },
    {
      name: "Mobile App Development Hackathon",
      description:
        "Participate in an exciting hackathon focused on building innovative mobile applications.",
      tags: ["mobile development", "iOS", "Android"],
      starttime: "2023-07-25T09:00:00",
      endttime: "2023-07-25T18:00:00",
      eventId: 3,
    },
  ];
});
export default component$(() => {
  const events = useEvents();

  return (
    <div>
      <div class=" flex items-center justify-between">
        <h1 class="py-4 text-3xl font-bold text-gray-800">Upcoming Events</h1>
      </div>{" "}
      <div>
        {events.value.map((event) => (
          <EventCard key={event.eventId} eventId={event.eventId} data={event} />
        ))}
      </div>
    </div>
  );
});
