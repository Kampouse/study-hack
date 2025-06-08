import { component$, useSignal } from "@builder.io/qwik";
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
  const urlData = req.url.searchParams.get("placeId") ?? "0";
  const places = await QueryPlaces({ event: req });
  const place = places.data?.find(
    (el) => el.Places?.PlaceID === parseInt(urlData),
  );
  return {
    Name: "just chilling with  " + user?.Name,
    Description: "",
    Location: place?.Places?.Name || "",
    PlaceId: parseInt(urlData) || 0,
    ImageURL: place?.Places?.ImageURL || "",
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
  const urlData = req.url.searchParams.get("placeId") ?? "0";
  const basePlace = places.data?.find(
    (el) => el.Places?.PlaceID === parseInt(urlData),
  );
  return { places: places, basePlace: basePlace };
});

export default component$(() => {
  const [, { Form, Field }] = useForm<Event, Data>({
    loader: useFormLoader(),
    validate: valiForm$(eventSchema),
    action: action(),
  });
  const data = useloadPlaces();
  const { places, basePlace } = data.value;
  const previewImage = useSignal<string | null>(
    data.value.places.data?.[0]?.Places?.ImageURL || null,
  );
  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      <section class="relative bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] pt-8">
        <div class="container px-4 md:px-6">
          <div class="my-8 flex flex-col items-start md:items-center">
            <h1 class="text-3xl font-bold text-[#5B3E29]">Host a Event</h1>
            <p class="max-w-2xl text-[#6D5D4E]">
              Create your own cozy event and connect with other like-minded
              individuals.
            </p>
          </div>
        </div>
      </section>

      <div class="container mx-auto max-w-4xl px-4 pb-16">
        <div class="rounded-2xl bg-white p-8 shadow-md">
          <Form class="space-y-6">
            <Field name="Name">
              {(field, props) => (
                <div class="space-y-2">
                  <label class="text-sm font-medium text-[#5B3E29]">
                    Session Name
                  </label>
                  <input
                    {...props}
                    class={`w-full rounded-xl border bg-white/50 px-4 py-3 text-[#5B3E29] shadow-sm transition-colors duration-300 focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20 ${
                      field.error ? "border-red-500" : "border-[#E6D7C3]"
                    }`}
                    type="text"
                    placeholder="e.g. Finals Prep Session"
                    value={field.value}
                  />
                  {field.error && (
                    <div class="text-xs text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>

            <Field name="Description">
              {(field, props) => (
                <div class="space-y-2">
                  <label class="text-sm font-medium text-[#5B3E29]">
                    Study Plan
                  </label>
                  <textarea
                    {...props}
                    class={`w-full rounded-xl border bg-white/50 px-4 py-3 text-[#5B3E29] shadow-sm transition-colors duration-300 focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20 ${
                      field.error ? "border-red-500" : "border-[#E6D7C3]"
                    }`}
                    rows={3}
                    placeholder="What topics are you planning to cover?"
                    value={field.value}
                  />
                  {field.error && (
                    <div class="text-xs text-red-500">{field.error}</div>
                  )}
                </div>
              )}
            </Field>

            <Field name="Location">
              {(field, props) => (
                <div class="space-y-2">
                  <label class="text-sm font-medium text-[#5B3E29]">
                    Study Location
                  </label>
                  <select
                    {...props}
                    class={`w-full rounded-xl border bg-white/50 px-4 py-3 text-[#5B3E29] shadow-sm transition-colors duration-300 focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20 ${
                      field.error ? "border-red-500" : "border-[#E6D7C3]"
                    }`}
                    value={field.value}
                    onChange$={(event) => {
                      if (!event.target) return;
                      const target = event.target as HTMLSelectElement;
                      const selectedPlace = places.data?.find(
                        (place) => place.Places?.Name === target.value,
                      );
                      previewImage.value =
                        selectedPlace?.Places?.ImageURL || null;
                    }}
                  >
                    {basePlace && (
                      <option
                        key={basePlace.Places?.PlaceID}
                        value={field.value}
                      >
                        {basePlace.Places?.Name}
                      </option>
                    )}

                    {places.data?.map((place) => (
                      <option
                        key={place.Places?.PlaceID}
                        value={place.Places?.Name}
                      >
                        {place.Places?.Name}
                      </option>
                    ))}
                  </select>
                  {field.error && (
                    <div class="text-xs text-red-500">{field.error}</div>
                  )}

                  {/* Location preview image */}
                  {previewImage.value && (
                    <div class="mt-3 overflow-hidden rounded-lg border border-[#E6D7C3]">
                      <div class="flex items-center justify-between bg-[#F8EDE3] px-3 py-2">
                        <p class="text-xs font-medium text-[#8B5A2B]">
                          Location Preview
                        </p>
                        <span class="text-xs text-[#8B5A2B]">
                          {places.data?.find(
                            (place) =>
                              place.Places?.ImageURL === previewImage.value,
                          )?.Places?.Address || ""}
                        </span>
                      </div>
                      <img
                        src={previewImage.value}
                        alt="Location preview"
                        height="200"
                        width="200"
                        class="h-60 w-full object-cover"
                        onError$={(_, el) => {
                          el.style.display = "none";
                          el.src = "/src/assets/just-rnd.png";
                        }}
                      />
                      <div class="bg-white/80 p-3">
                        <div class="flex flex-wrap gap-2">
                          {places.data
                            ?.find(
                              (place) =>
                                place.Places?.ImageURL === previewImage.value,
                            )
                            ?.Places?.Tags?.map((tag, i) => (
                              <span
                                key={i}
                                class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <p class="mt-2 text-sm text-[#5B3E29]">
                          {places.data
                            ?.find(
                              (place) =>
                                place.Places?.ImageURL === previewImage.value,
                            )
                            ?.Places?.Description?.substring(0, 100)}
                          {(places.data?.find(
                            (place) =>
                              place.Places?.ImageURL === previewImage.value,
                          )?.Places?.Description?.length || 0) > 100
                            ? "..."
                            : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Field>

            <Field name="ImageURL">
              {(field, props) => (
                <div class="space-y-2">
                  <label class="text-sm font-medium text-[#5B3E29]">
                    Cover Image URL (Optional)
                  </label>
                  <div class="space-y-2">
                    <input
                      {...props}
                      class={`w-full rounded-xl border bg-white/50 px-4 py-3 text-[#5B3E29] shadow-sm transition-colors duration-300 focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20 ${
                        field.error ? "border-red-500" : "border-[#E6D7C3]"
                      }`}
                      type="text"
                      placeholder="Paste an image URL here"
                      value={field.value}
                    />
                    {field.error && (
                      <div class="text-xs text-red-500">{field.error}</div>
                    )}
                  </div>
                  {field.value && (
                    <div class="mt-2 overflow-hidden rounded-lg border border-[#E6D7C3]">
                      <p class="bg-[#F8EDE3] px-3 py-1 text-xs font-medium text-[#8B5A2B]">
                        Event Cover Preview
                      </p>
                      <img
                        src={field.value}
                        alt="Image preview"
                        height="200"
                        width="200"
                        class="h-60 w-full object-cover"
                        onError$={(_, el) => {
                          el.style.display = "none";
                          el.src = "/src/assets/just-rnd.png";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </Field>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Field name="Date">
                {(field, props) => (
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-[#5B3E29]">
                      Date
                    </label>
                    <input
                      {...props}
                      class={`w-full rounded-xl border bg-white/50 px-4 py-3 text-[#5B3E29] shadow-sm transition-colors duration-300 focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20 ${
                        field.error ? "border-red-500" : "border-[#E6D7C3]"
                      }`}
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={field.value}
                    />
                    {field.error && (
                      <div class="text-xs text-red-500">{field.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <Field name="StartTime">
                {(field, props) => (
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-[#5B3E29]">
                      Start Time
                    </label>
                    <select
                      {...props}
                      class={`w-full rounded-xl border bg-white/50 px-4 py-3 text-[#5B3E29] shadow-sm transition-colors duration-300 focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20 ${
                        field.error ? "border-red-500" : "border-[#E6D7C3]"
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
                    {field.error && (
                      <div class="text-xs text-red-500">{field.error}</div>
                    )}
                  </div>
                )}
              </Field>

              <Field name="EndTime">
                {(field, props) => (
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-[#5B3E29]">
                      End Time
                    </label>
                    <select
                      {...props}
                      class={`w-full rounded-xl border bg-white/50 px-4 py-3 text-[#5B3E29] shadow-sm transition-colors duration-300 focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20 ${
                        field.error ? "border-red-500" : "border-[#E6D7C3]"
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
                    {field.error && (
                      <div class="text-xs text-red-500">{field.error}</div>
                    )}
                  </div>
                )}
              </Field>
            </div>

            <button
              class="inline-flex w-full items-center justify-center rounded-md bg-[#D98E73] px-4 py-3 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              type="submit"
            >
              Create Study Session
            </button>
          </Form>
        </div>
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
