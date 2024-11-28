import { component$ } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import { createEventForm } from "~/api/Forms";
import {} from "@modular-forms/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { eventSchema } from "~/api/Forms";
import { useNavigate } from "@builder.io/qwik-city";
import { valiForm$, formAction$ } from "@modular-forms/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import type * as v from "valibot";
import { GetUser, QueryPlaces } from "~/api/Query";
//get the type from event schema
type Event = v.InferInput<typeof eventSchema>;
export const useFormLoader = routeLoader$<InitialValues<Event>>(async (req) => {
  const user = await GetUser({ event: req });

  return {
    Name: "chill with " + user?.Name,
    Description: "",
    Location: "",
    PlaceId: 0,
    ImageURL: "https://example.com/image.jpg",
    Date: new Date().toISOString().split("T")[0],
    StartTime: "",
    EndTime: "",
    Coordinates: [0, 0],
    Tags: [],
  };
});

//take the return type of createEventForm and return it and remove the promise from it
type Data =
  ReturnType<typeof createEventForm> extends Promise<infer T> ? T : never;

const action = formAction$<Event, Data>(async (data, event) => {
  console.log("hello");
  const output = await createEventForm(data, event);

  if (output.success && output.data != null) {
    return {
      data: output,
      success: true,
      message: "Event created successfully",
    };
  } else if (!output.success && output.error) {
    return {
      data: output,
      success: false,
      message: "Failed to create event",
    };
  } else {
    return {
      data: output,
      success: false,
      message: "Unexpected error occurred",
    };
  }
}, valiForm$(eventSchema));

export const useloadPlaces = routeLoader$(async (req) => {
  const places = await QueryPlaces({ event: req });
  return places;
});

export default component$(() => {
  const nav = useNavigate();
  const [FormEvent, { Form, Field }] = useForm<Event, Data>({
    loader: useFormLoader(),
    validate: valiForm$(eventSchema),
    action: action(),
  });
  const places = useloadPlaces();
  return (
    <div class="m-4 mx-auto max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
      <h1 class="p-8 pb-0 text-3xl font-bold text-gray-800">
        Create your Event
      </h1>
      <div class="p-8">
        <p class="mb-6 text-gray-600">Add details and create your event</p>
        <Form
          class="flex flex-col gap-6"
          onSubmit$={() => {
            if (FormEvent.submitted) {
              // this should point to the correct pages not just
              nav(`/new/1/success`);
            }
          }}
        >
          <Field name="Name">
            {(field, props) => (
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700">
                  Event name
                </label>
                <input
                  {...props}
                  class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Just studyin' for fun :/"
                  value={field.value}
                />
              </div>
            )}
          </Field>

          <Field name="Description">
            {(field, props) => (
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700">
                  What will you be working on?
                </label>
                <textarea
                  {...props}
                  class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  rows={3}
                  placeholder="I will be learning about machine learning."
                  value={field.value}
                />
              </div>
            )}
          </Field>

          <Field name="Location">
            {(field, props) => (
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700">
                  Where will you be?
                </label>
                <select
                  {...props}
                  class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  value={field.value}
                >
                  <option value="">Select a location...</option>
                  {places.value.data?.map((place) => (
                    <option key={place.PlaceID} value={place.Name}>
                      {place.Name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Field>

          <Field name="ImageURL">
            {(field, props) => (
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700">
                  Image link (optional)
                </label>
                <input
                  {...props}
                  class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={field.value}
                />
              </div>
            )}
          </Field>

          <div class="flex items-center gap-4">
            <Field name="Date">
              {(field, props) => (
                <div class="flex w-full flex-col gap-2">
                  <label class="text-sm font-bold text-gray-700">Date</label>
                  <input
                    {...props}
                    class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      field.error ? "border-red-500" : "border-gray-300"
                    }`}
                    type="date"
                    placeholder="03/03/24"
                    value={field.value}
                  />
                </div>
              )}
            </Field>
            <Field name="StartTime">
              {(field, props) => (
                <div class="flex w-full flex-col gap-2">
                  <label class="text-sm font-bold text-gray-700">
                    Start Time
                  </label>
                  <input
                    {...props}
                    class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      field.error ? "border-red-500" : "border-gray-300"
                    }`}
                    type="time"
                    placeholder="16:30"
                    value={field.value}
                  />
                </div>
              )}
            </Field>
            <Field name="EndTime">
              {(field, props) => (
                <div class="flex w-full flex-col gap-2">
                  <label class="text-sm font-bold text-gray-700">
                    End Time
                  </label>
                  <input
                    {...props}
                    class={`w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      field.error ? "border-red-500" : "border-gray-300"
                    }`}
                    type="time"
                    placeholder="16:30"
                    value={field.value}
                  />
                </div>
              )}
            </Field>
          </div>
          <button
            class="w-full rounded-md bg-green-500 px-4 py-2 font-bold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            type="submit"
          >
            Create a public Session
          </button>
        </Form>
      </div>
    </div>
  );
});
export const head: DocumentHead = {
  // This will be used to resolve the <title> of the page
  title: "S&H | New Event",
  meta: [],
  links: [
    {
      rel: "canonical",
    },
  ],
};
