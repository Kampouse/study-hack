import * as Icons from "lucide-qwik";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm } from "@modular-forms/qwik";
import { valiForm$ } from "@modular-forms/qwik";
import { joinRequestSchema } from "~/api/Forms";
type JoinRequest = v.InferInput<typeof joinRequestSchema>;
import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import type * as v from "valibot";
import { getEvent } from "~/api/EndPoint";

export const head = {
  title: "S&H | Join Event",
  description: "Join the Web Development Enthusiasts Meetup",
};

export const useEventDetails = routeLoader$(async (request) => {
  const payload = await getEvent(request, request.params.id);
  if (payload.data == null) {

    throw request.redirect(302, "/app/join/");

  }
  return {
    data: { ...payload.data, success: payload.success },
  };
});
export const useFormLoader = routeLoader$<InitialValues<JoinRequest>>(
  async () => {
    return {
      Name: "",
      ExperienceLevel: "",
      Background: "",
      WhyJoin: "",
    };
  },
);

export const action = formAction$(async () => {
  // Handle joining event logic here

  return {
    success: true,
    message: "You have successfully joined the event!",
  };
}, valiForm$(joinRequestSchema));

export default component$(() => {
  const nav = useNavigate();
  const event = useEventDetails();

  const [, { Form, Field }] = useForm<JoinRequest>({
    validate: valiForm$(joinRequestSchema),
    loader: useFormLoader(),
    action: action(),
  });

  return (
    <div class="m-4 mx-auto max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
      <h1 class="p-8 pb-0 text-3xl font-bold text-gray-800">
        {event.value.data.name || "Event Name"}
      </h1>
      <div class="px-8 pb-4">
        <div class="">
          <div class="flex items-center">
            <Icons.CalendarIcon class="text-gray mr-2 h-5 w-5" />
            <p class="py-2 text-gray-700">
              {new Date(event.value.data.date || "0").toLocaleDateString() ||
                "Event Date"}
            </p>
          </div>
          <div class="flex items-center">
            <Icons.MapPinIcon class="mr-2 h-5 w-5 text-green-600" />
            <p class="text-gray-700">
              {" "}
              {event.value.data.location || "Event place"}
            </p>
          </div>
          <div class="flex items-center">
            <Icons.UserIcon class="mr-2 h-5 w-5 text-green-600" />
            <p class="text-gray-700">{event.value.data.image}</p>
          </div>
        </div>
      </div>
      <img
        src={event.value.data.image || "https://via.placeholder.com/800"}
        alt={event.value.data.name || "Event Image"}
        height={400}
        width={800}
        class="h-[400px] w-[800px]  rounded-md  object-cover px-8"
      />
      <div class="p-8 py-4">
        <p class="mb-6 text-gray-600">
          {event.value.data.description || "hello"}
        </p>
      </div>
      <Form
        class="px-8 pb-8"
        onSubmit$={() => nav(`/app/join/${event.value.data.eventID}/success`)}
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
                    class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${field.error ? "border-red-500" : ""
                      }`}
                    placeholder="Your full name"
                    value={field.value}
                  />
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
                    class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${field.error ? "border-red-500" : ""
                      }`}
                    value={field.value}
                  >
                    <option value="">Select your experience level</option>

                    <option value="curious">Curious</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
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
                  class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${field.error ? "border-red-500" : ""
                    }`}
                  placeholder="Share your background"
                  value={field.value}
                />
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
                  class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${field.error ? "border-red-500" : ""
                    }`}
                  placeholder="Tell us why you want to join"
                  value={field.value}
                />
              </div>
            )}
          </Field>
        </div>
        <button
          type="submit"
          class="w-full rounded-md bg-green-500 px-4 py-2 font-bold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Register
        </button>
      </Form>
    </div>
  );
});
