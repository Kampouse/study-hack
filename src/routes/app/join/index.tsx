import { component$ } from "@builder.io/qwik";
import { routeLoader$, Form, routeAction$ } from "@builder.io/qwik-city";
import * as Icons from "lucide-qwik"

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
        {joinAction.value?.success && (
          <p class="mt-4 text-center font-semibold text-green-600">
            {joinAction.value.message}
          </p>
        )}
      </div>
      <Form class="px-8 pb-8" action={joinAction}>
        <div class="mb-6 flex flex-col space-y-4">
          <div class="flex space-x-4">
            <div class="flex-1">
              <label
                for="name"
                class="mb-2 block text-sm font-bold text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>
            <div class="flex-1">
              <label
                for="experienceLevel"
                class="mb-2 block text-sm font-bold text-gray-700"
              >
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div class="flex-1">
            <label
              for="background"
              class="mb-2 block text-sm font-bold text-gray-700"
            >
              Background
            </label>
            <textarea
              id="background"
              name="background"
              rows={3}
              class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your background"
            />
          </div>
          <div class="flex-1">
            <label
              for="whyJoin"
              class="mb-2 block text-sm font-bold text-gray-700"
            >
              Why do you want to join?
            </label>
            <textarea
              id="whyJoin"
              name="whyJoin"
              rows={3}
              class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us why you want to join this event"
            />
          </div>
        </div>
        <button
          type="submit"
          class="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Join Event
        </button>
      </Form>
    </div>
  );
});
