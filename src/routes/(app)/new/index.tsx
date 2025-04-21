import { component$ } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import { createEventForm } from "~/api/Forms";
import {} from "@modular-forms/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { eventSchema } from "~/api/Forms";
import { valiForm$, formAction$ } from "@modular-forms/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import type * as v from "valibot";
import { GetUser, QueryPlaces } from "~/api/Query";

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

type Data =
  ReturnType<typeof createEventForm> extends Promise<infer T> ? T : never;

const action = formAction$<Event, Data>(async (data, event) => {
  const places = await QueryPlaces({ event: event });

  const place = places.data?.find((el) => el.Places?.Name === data.Location);

  const output = await createEventForm(
    { ...data, PlaceId: place?.Places?.PlaceID as number },
    event,
  );

  if (output.success && output.data != null) {
    throw event.redirect(302, `/new/${output.data[0].EventID}/success`);
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
  const [, { Form, Field }] = useForm<Event, Data>({
    loader: useFormLoader(),
    validate: valiForm$(eventSchema),
    action: action(),
  });
  const places = useloadPlaces();
  return (
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <div class="w-full rounded-2xl border border-gray-300 bg-gradient-to-br from-white/80 to-gray-100/50 p-8 shadow-sm transition-all duration-300 hover:border-green-100 hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-50/70">
        <h1 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
          Create Your Study Session
        </h1>
        <p class="mb-8 text-sm leading-relaxed text-gray-600">
          Share your study plans and connect with others
        </p>

        <Form class="space-y-6">
          <Field name="Name">
            {(field, props) => (
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  Session Name
                </label>
                <input
                  {...props}
                  class={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-gray-700 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="e.g. Finals Prep Session"
                  value={field.value}
                />
              </div>
            )}
          </Field>

          <Field name="Description">
            {(field, props) => (
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  Study Plan
                </label>
                <textarea
                  {...props}
                  class={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-gray-700 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  rows={3}
                  placeholder="What topics are you planning to cover?"
                  value={field.value}
                />
              </div>
            )}
          </Field>

          <Field name="Location">
            {(field, props) => (
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  Study Location
                </label>
                <select
                  {...props}
                  class={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-gray-700 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  value={field.value}
                >
                  <option value="">Choose a study spot...</option>
                  {places.value.data?.map((place) => (
                    <option
                      key={place.Places?.PlaceID}
                      value={place.Places?.Name}
                    >
                      {place.Places?.Name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Field>

          <Field name="ImageURL">
            {(field, props) => (
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  Cover Image URL (Optional)
                </label>
                <input
                  {...props}
                  class={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-gray-700 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    field.error ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Paste an image URL here"
                  value={field.value}
                />
              </div>
            )}
          </Field>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field name="Date">
              {(field, props) => (
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Date</label>
                  <input
                    {...props}
                    class={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-gray-700 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      field.error ? "border-red-500" : "border-gray-300"
                    }`}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={field.value}
                  />
                </div>
              )}
            </Field>

            <Field name="StartTime">
              {(field, props) => (
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <select
                    {...props}
                    class={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-gray-700 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      field.error ? "border-red-500" : "border-gray-300"
                    }`}
                    value={field.value}
                  >
                    <option value="">Select time...</option>
                    {Array.from({ length: 24 }, (_, i) => (
                      <option
                        key={i}
                        value={`${i.toString().padStart(2, "0")}:00`}
                      >
                        {i === 0
                          ? "12:00 AM"
                          : i < 12
                            ? `${i}:00 AM`
                            : i === 12
                              ? "12:00 PM"
                              : `${i - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Field>

            <Field name="EndTime">
              {(field, props) => (
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <select
                    {...props}
                    class={`w-full rounded-xl border bg-white/50 px-4 py-2.5 text-gray-700 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      field.error ? "border-red-500" : "border-gray-300"
                    }`}
                    value={field.value}
                  >
                    <option value="">Select time...</option>
                    {Array.from({ length: 24 }, (_, i) => (
                      <option
                        key={i}
                        value={`${i.toString().padStart(2, "0")}:00`}
                      >
                        {i === 0
                          ? "12:00 AM"
                          : i < 12
                            ? `${i}:00 AM`
                            : i === 12
                              ? "12:00 PM"
                              : `${i - 12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Field>
          </div>

          <button
            class="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
            type="submit"
          >
            Create Study Session
          </button>
        </Form>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "S&H | New Session",
  meta: [
    {
      name: "description",
      content: "Create a new study session and connect with others",
    },
  ],
  links: [
    {
      rel: "canonical",
    },
  ],
};
