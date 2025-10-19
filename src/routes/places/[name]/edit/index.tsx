import { component$, useSignal } from "@builder.io/qwik";
import { useForm, valiForm$, formAction$ } from "@modular-forms/qwik";
import { placeSchema } from "~/api/Forms";
import type { PlaceForm } from "~/api/Forms";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useNavigate, server$ } from "@builder.io/qwik-city";
import { GetUser, UpdatePlace } from "~/api/Query";
import { getPlace } from "~/api/EndPoint";
import type { Maybe } from "@modular-forms/qwik";
import {
  MapPinIcon as MapPin,
  StarIcon as Star,
  WifiIcon as Wifi,
} from "lucide-qwik";

// Simplified GeoResponse type
type GeoResponse = {
  results: Array<{
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
};

export const usePlaceLoader = routeLoader$(async (requestEvent) => {
  const placeId = requestEvent.params.name;
  const user = await GetUser({ event: requestEvent });

  if (!user) {
    throw requestEvent.redirect(302, "/login");
  }

  const place = await getPlace({
    event: requestEvent,
    placeName: placeId,
  });

  if (!place.data) {
    throw requestEvent.redirect(302, "/places/");
  }

  // Convert place data to form structure
  return {
    name: place.data.Name || "",
    address: place.data.Address || "",
    description: place.data.Description || "",
    image: place.data.ImageURL || "",
    tags: place.data.Tags || [],
    rating: place.data.Rating.toString() || "3",
    wifispeed: place.data.WifiSpeed || 0,
    hasquietenvironment: place.data.HasQuietEnvironment || false,
    price: place.data.Price || "",
    coordinates: place.data.Coordinates || [0, 0],
    category: place.data.Category || "",
  } as {
    name: Maybe<string>;
    address: Maybe<string>;
    description: Maybe<string>;
    image: Maybe<string>;
    tags: string[] | undefined;
    rating: Maybe<string>;
    wifispeed: Maybe<number>;
    hasquietenvironment: Maybe<boolean>;
    price: Maybe<string>;
    coordinates: [number, number] | undefined;
    category: Maybe<string>;
  };
});

// Geocoding server function
const FindLocation = server$(async function (address: string) {
  const session = this.sharedMap.get("session");
  const GEO = this.env.get("GOOGLE_GEO");

  if (!session) {
    return { status: "error", message: "No session found" };
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?key=${GEO}&address=${address}`,
  );
  const data = (await response.json()) as GeoResponse;

  return data.results.map((result) => ({
    address: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  }));
});

const useUpdatePlaceAction = formAction$<PlaceForm, any>(
  async (values, event) => {
    const user = await GetUser({ event });
    const placeId = event.params.name;

    if (!user) {
      return { status: "error", message: "User not found" };
    }

    // Fetch place to verify ownership
    const place = await getPlace({ event, placeName: placeId });

    if (!place.data) {
      return { status: "error", message: "Place not found" };
    }

    // Check authorization
    if (place.data.UserID !== user.ID) {
      return { status: "error", message: "Not authorized to edit this place" };
    }

    // Handle coordinates

    // Build place data object with only defined values
    const placeData = {
      name: values.name,
      address: values.address,
      image: values.image,
      description: values.description,
      tags: values.tags,
      rating: values.rating ? parseInt(values.rating) : undefined,
      wifiSpeed: values.wifispeed,
      hasQuietEnvironment:
        values.hasquietenvironment ??
        (values.tags ? values.tags.includes("Quiet") : undefined),
    };

    // Add coordinates if address was updated
    // Update the place
    const result = await UpdatePlace({
      event,
      placeId: place.data.PlaceID,
      placeData,
    });

    if (result.success) {
      // Redirect to the place page or places list
      if (result.data?.Name) {
        throw event.redirect(302, `/places/${result.data.Name}`);
      } else {
        throw event.redirect(302, "/places");
      }
    }

    return {
      status: "error",
      message: result.message || "Failed to update place",
    };
  },
  valiForm$(placeSchema),
);

export default component$(() => {
  const places = useSignal<
    Array<{ address: string; lat: number; lng: number }>
  >([]);
  const placeName = useSignal("");
  const suggestedTags = useSignal([
    "Coffee",
    "Quiet",
    "WiFi",
    "Outdoor Seating",
    "Group Friendly",
    "Power Outlets",
    "Affordable",
    "Spacious",
    "Good Lighting",
    "Meeting Rooms",
    "Social",
    "Networking",
    "Focus Friendly",
    "Collaborative",
    "Long Hours",
    "Private Booths",
  ]);

  const nav = useNavigate();
  const [, { Form, Field }] = useForm<PlaceForm, any>({
    loader: usePlaceLoader(),
    action: useUpdatePlaceAction(),
  });

  // Common input field styles
  const getInputClass = (hasError: boolean) => `
    block w-full rounded-md border bg-white px-3 py-2 text-sm
    text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F]
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
    }
  `;

  const renderFieldError = (error: string | undefined) =>
    error && <div class="mt-1 text-sm text-red-400">{error}</div>;

  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      <section class="relative bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] pb-8 pt-8">
        <div class="container px-4 md:px-6">
          <div class="mx-auto my-24 max-w-3xl">
            <div class="mb-6 flex items-center">
              <h1 class="text-3xl font-bold text-[#5B3E29]">
                Edit Your Cozy Spot
              </h1>
            </div>
            <p class="mb-8 text-[#6D5D4E]">
              Update the details of your shared study space
            </p>

            <div class="overflow-hidden rounded-xl border-none bg-white p-6 shadow-md md:p-8">
              <Form class="space-y-6">
                <Field name="name" type="string">
                  {(field, props) => (
                    <div>
                      <label
                        for="name"
                        class="mb-2 block text-sm font-medium text-[#5B3E29]"
                      >
                        Place Name
                      </label>
                      <input
                        {...props}
                        type="text"
                        class={getInputClass(!!field.error)}
                        value={field.value}
                        placeholder="e.g. Cozy Corner Cafe"
                      />
                      {renderFieldError(field.error)}
                    </div>
                  )}
                </Field>

                <Field name="address" type="string">
                  {(field, props) => (
                    <div>
                      <label
                        for="address"
                        class="mb-2 block text-sm font-medium text-[#5B3E29]"
                      >
                        Address
                      </label>

                      <div class="flex gap-2">
                        <div class="relative flex-grow">
                          <MapPin class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D98E73]" />
                          <input
                            {...props}
                            type="text"
                            class={`${getInputClass(!!field.error)} pl-10`}
                            value={field.value}
                            placeholder="Enter location address"
                          />
                        </div>
                        <button
                          type="button"
                          onClick$={async () => {
                            const output = await FindLocation(
                              field.value as string,
                            );
                            if (Array.isArray(output)) {
                              places.value = output;
                            }
                          }}
                          class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white hover:bg-[#C27B62] focus-visible:ring-2 focus-visible:ring-[#D98E73] focus-visible:ring-offset-2"
                        >
                          Find
                        </button>
                      </div>
                      {renderFieldError(field.error)}

                      {places.value.length > 0 && (
                        <div class="mt-4">
                          <div class="max-h-48 overflow-y-auto rounded-md border border-[#E6D7C3] bg-[#F8EDE3]/30 p-3">
                            <div class="space-y-2">
                              {places.value.map((address, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick$={() => {
                                    field.value = address.address;
                                  }}
                                  class="w-full rounded-md border border-[#E6D7C3] bg-white p-2 text-left text-sm text-[#6D5D4E] shadow-sm hover:bg-[#FFF1E6] hover:shadow-md"
                                >
                                  {address.address}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="image" type="string">
                  {(field, props) => (
                    <div>
                      <label
                        for="image"
                        class="mb-2 block text-sm font-medium text-[#5B3E29]"
                      >
                        Image URL
                      </label>
                      <input
                        {...props}
                        type="text"
                        class={getInputClass(!!field.error)}
                        value={field.value}
                        placeholder="Enter URL for place image"
                      />
                      {renderFieldError(field.error)}
                    </div>
                  )}
                </Field>

                <Field name="description" type="string">
                  {(field, props) => (
                    <div>
                      <label
                        for="description"
                        class="mb-2 block text-sm font-medium text-[#5B3E29]"
                      >
                        Description
                      </label>
                      <textarea
                        {...props}
                        class={getInputClass(!!field.error)}
                        rows={3}
                        value={field.value}
                        placeholder="Describe what makes this place special for studying or relaxing"
                      ></textarea>
                      {renderFieldError(field.error)}
                    </div>
                  )}
                </Field>

                <Field name="tags" type="string[]">
                  {(field) => (
                    <div>
                      <label class="mb-2 block text-sm font-medium text-[#5B3E29]">
                        Tags
                      </label>
                      <p class="mb-2 text-xs text-[#6D5D4E]">
                        Select tags that best describe this place:
                      </p>

                      <div class="flex flex-wrap gap-2">
                        {suggestedTags.value.map((tag) => (
                          <div key={tag} class="flex items-center">
                            <label
                              class={`flex cursor-pointer items-center rounded-full px-3 py-1 text-sm transition-colors ${
                                field.value?.includes(tag)
                                  ? "bg-[#F8D7BD] text-[#8B5A2B]"
                                  : "bg-[#F8EDE3] text-[#6D5D4E] hover:bg-[#F8EDE3]/80"
                              }`}
                            >
                              <input
                                type="checkbox"
                                class="sr-only"
                                checked={field.value?.includes(tag)}
                                onChange$={() => {
                                  if (field.value?.includes(tag)) {
                                    field.value = field.value.filter(
                                      (t) => t !== tag,
                                    );
                                  } else {
                                    field.value = [...(field.value || []), tag];
                                  }
                                }}
                              />
                              {tag}
                              {field.value?.includes(tag) && (
                                <span class="ml-1 font-bold">✓</span>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                      {renderFieldError(field.error)}

                      <div class="mt-3">
                        <p class="text-sm text-[#5B3E29]">Selected tags:</p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          {field.value?.length ? (
                            field.value.map((tag, index) => (
                              <div
                                key={index}
                                class="flex items-center rounded-full bg-[#F8D7BD] px-3 py-1 text-sm text-[#8B5A2B]"
                              >
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  onClick$={() => {
                                    field.value = field.value?.filter(
                                      (_, i) => i !== index,
                                    );
                                  }}
                                  class="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#D98E73]/20 text-[#8B5A2B] hover:bg-[#D98E73]/50"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          ) : (
                            <p class="text-xs italic text-[#6D5D4E]">
                              No tags selected
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Field>

                <div class="grid gap-6 md:grid-cols-2">
                  <Field name="rating" type="string">
                    {(field, props) => (
                      <div>
                        <label
                          for="rating"
                          class="mb-2 block text-sm font-medium text-[#5B3E29]"
                        >
                          Rating
                        </label>
                        <div class="relative">
                          <Star class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D98E73]" />
                          <select
                            {...props}
                            class={`${getInputClass(!!field.error)} pl-10`}
                            value={field.value?.toString()}
                          >
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </div>
                        {renderFieldError(field.error)}
                      </div>
                    )}
                  </Field>

                  <Field name="wifispeed" type="number">
                    {(field, props) => (
                      <div>
                        <label
                          for="wifispeed"
                          class="mb-2 block text-sm font-medium text-[#5B3E29]"
                        >
                          Wi-Fi Speed (Mbps)
                        </label>
                        <div class="relative">
                          <Wifi class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D98E73]" />
                          <input
                            {...props}
                            type="number"
                            class={`${getInputClass(!!field.error)} pl-10`}
                            value={field.value?.toString()}
                            placeholder="e.g. 50"
                          />
                        </div>
                        {renderFieldError(field.error)}
                      </div>
                    )}
                  </Field>
                </div>

                <div class="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick$={() => nav("/places/" + placeName.value)}
                    class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] hover:bg-[#FFF1E6] sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white hover:bg-[#C27B62] sm:flex-grow"
                  >
                    Update Place
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});
