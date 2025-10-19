import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
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
import { ErrorAlert } from "~/components/ui/ErrorAlert";

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
    ImageURL: "",
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
      message: output.error,
    };
  } else {
    return {
      data: output,
      success: false,
      message: "We couldn't create your event. Please try again.",
    };
  }
}, valiForm$(eventSchema));

export const useloadPlaces = routeLoader$(async (req) => {
  const places = await QueryPlaces({ event: req });
  const urlData = req.url.searchParams.get("placeId") ?? "0";
  const basePlace = places.data?.find(
    (el) => el.Places?.PlaceID === parseInt(urlData),
  );
  return { places: places, basePlace: basePlace, url: urlData };
});

export default component$(() => {
  const [formResponse, { Form, Field }] = useForm<Event, Data>({
    loader: useFormLoader(),
    validate: valiForm$(eventSchema),
    action: action(),
  });
  const data = useloadPlaces();
  const { places, basePlace } = data.value;
  const previewImage = useSignal<string | null>(
    data.value.url !== "0"
      ? data.value.basePlace?.Places?.ImageURL || null
      : data.value.places.data?.[0]?.Places?.ImageURL || null,
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
          {formResponse.response.message &&
            (formResponse.response.data as any)?.success === false && (
              <ErrorAlert
                message={formResponse.response.message}
                type="error"
              />
            )}
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
                        <Link
                          href={`/places/${
                            places.data?.find(
                              (place) =>
                                place.Places?.ImageURL === previewImage.value,
                            )?.Places?.Name
                          }`}
                          class="group flex items-center gap-1 rounded-md bg-[#F8D7BD] px-2 py-1 text-xs font-medium text-[#8B5A2B] transition-all hover:bg-[#D98E73] hover:text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3 transition-transform group-hover:rotate-45"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Explore this location
                        </Link>
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
                            ?.Places?.Description.substring(0, 100)}
                          {(places.data?.find(
                            (place) =>
                              place.Places?.ImageURL === previewImage.value,
                          )?.Places?.Description.length || 0) > 100
                            ? "..."
                            : ""}
                        </p>
                      </div>
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
