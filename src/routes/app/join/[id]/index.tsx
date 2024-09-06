import * as Icons from "lucide-qwik";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm } from "@modular-forms/qwik";
import { valiForm$ } from "@modular-forms/qwik";
import { joinRequestSchema } from "~/api/Forms";
type JoinRequest = v.InferInput<typeof joinRequestSchema>;
import { component$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import * as Icons from "lucide-qwik";
import type * as v from "valibot";

export const useEventDetails = routeLoader$(async ({ params }) => {
  // Fetch event details based on params.eventId
  // This is a placeholder, replace with actual API call
  return {
    id: params.id,
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
export const useFormLoader = routeLoader$<InitialValues<JoinRequest>>(
  async (req) => {
    return {
      Name: "",
      ExperienceLevel: "",
      Background: "",
      WhyJoin: "",
    };
  },
);

export const action = formAction$(async (data, req) => {
  // Handle joining event logic here
  console.log("Joining event", data);
}, valiForm$(joinRequestSchema));

export default component$(() => {
  const nav = useNavigate();
  const event = useEventDetails();
  console.log(event.value);

  const [joinForm, { Form, Field }] = useForm<JoinRequest>({
    validate: valiForm$(joinRequestSchema),
    loader: useFormLoader(),
    action: action(),
  });

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
        {action.value?.success && (
          <p class="mt-4 text-center font-semibold text-green-600">
            {action.value.message}
          </p>
        )}
      </div>
      <Form
        class="px-8 pb-8"
        onSubmit$={() => nav(`/app/join/${event.value.id}/success`)}
      >
        <div class="mb-6 flex flex-col space-y-4">
          <div class="flex space-x-4">
            <Field name="Name">
              {(field, props) => (
                <div class="flex-1">
                  <label
                    for={props.name}
                    class="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    {...props}
                    type="text"
                    class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                    value={field.value}
                  />
                  {field?.error && (
                    <div class="text-sm text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>
            <Field name="ExperienceLevel">
              {(field, props) => (
                <div class="flex-1">
                  <label
                    for={props.name}
                    class="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Experience Level
                  </label>
                  <select
                    {...props}
                    class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={field.value}
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {field.error && (
                    <div class="text-sm text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>
          </div>
          <Field name="Background">
            {(field, props) => (
              <div class="flex-1">
                <label
                  for={props.name}
                  class="mb-2 block text-sm font-bold text-gray-700"
                >
                  Background
                </label>
                <textarea
                  {...props}
                  rows={3}
                  class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your background"
                  value={field.value}
                />
                {field.error && (
                  <div class="text-sm text-red-500">{field.error}</div>
                )}
              </div>
            )}
          </Field>
          <Field name="WhyJoin">
            {(field, props) => (
              <div class="flex-1">
                <label
                  for={props.name}
                  class="mb-2 block text-sm font-bold text-gray-700"
                >
                  Why do you want to join?
                </label>
                <textarea
                  {...props}
                  rows={3}
                  class="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you want to join"
                  value={field.value}
                />
                {field.error && (
                  <div class="text-sm text-red-500">{field.error}</div>
                )}
              </div>
            )}
          </Field>
        </div>
        <button
          type="submit"
          class="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Register
        </button>
      </Form>
    </div>
  );
});
