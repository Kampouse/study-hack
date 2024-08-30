import { component$ } from "@builder.io/qwik";
import { routeLoader$, Form, routeAction$ } from "@builder.io/qwik-city";
import * as Icons from "lucide-qwik";

export const useEventDetails = routeLoader$(async ({ params }) => {
  // Fetch event details based on params.eventId
  // This is a placeholder, replace with actual API call
  return {
    id: params.eventId,
    name: "Web Development Enthusiasts Meetup",
    date: "2023-07-15",
    time: "2:00 PM",
    description:
      "Join us for an exciting afternoon of web development discussions, coding challenges, and networking. Whether you're a beginner or an experienced developer, this meetup is perfect for sharing knowledge and making new connections in the tech community.",
    location: "TechHub Coworking Space, 123 Main St, Techville",
    organizer: "TechVille Developers Association",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia2.ledevoir.com%2Fimages_galerie%2Fnwd_486762_343963%2Fimage.jpg&f=1&nofb=1&ipt=0c95c5b858d16d6c4e938def46ebbaec329f08aaff69bb99bc4dc7e58d14ea56&ipo=images",
  };
});

export const useJoinEvent = routeAction$(async (data) => {
  // Handle joining event logic here
  console.log("Joining event", data);
  return {
    success: true,
    message: "Successfully joined the event!",
  };
});

export default component$(() => {
  const event = useEventDetails();
  const joinAction = useJoinEvent();

  return (
    <div class="m-4 mx-auto max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
      <h1 class="p-8 pb-0 text-3xl font-bold text-gray-800">
        {event.value.name}
      </h1>
      <div class="px-8 pb-4">
        <div class="">
          <div class="flex items-center">
            <Icons.CalendarIcon class="text-gray mr-2 h-5 w-5" />
            <p class="py-2 text-gray-700">
              {event.value.date} at {event.value.time}
            </p>
          </div>
          <div class="flex items-center">
            <Icons.MapPinIcon class="mr-2 h-5 w-5 text-green-600" />
            <p class="text-gray-700">{event.value.location}</p>
          </div>
          <div class="flex items-center">
            <Icons.UserIcon class="mr-2 h-5 w-5 text-green-600" />
            <p class="text-gray-700">{event.value.organizer}</p>
          </div>
        </div>
      </div>
      <img
        src={event.value.image}
        alt={event.value.name}
        height={400}
        width={800}
        class="h-[400px] w-[800px]  rounded-md  object-cover px-8"
      />
      <div class="p-8 py-4">
        <p class="mb-6 text-gray-600">{event.value.description}</p>

        <Form action={joinAction}>
          <input type="hidden" name="eventId" value={event.value.id} />
          <button
            type="submit"
            class="w-fit rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition duration-300 hover:bg-indigo-700"
          >
            Join This Meetup
          </button>
        </Form>
        {joinAction.value?.success && (
          <p class="mt-4 text-center font-semibold text-green-600">
            {joinAction.value.message}
          </p>
        )}
      </div>
    </div>
  );
});
