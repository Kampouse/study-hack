import { component$, useSignal } from "@builder.io/qwik";
import { useForm, valiForm$, formAction$ } from "@modular-forms/qwik";
import type { PlaceForm } from "~/api/Forms";
import { placeSchema } from "~/api/Forms";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useNavigate, server$ } from "@builder.io/qwik-city";
import { CreatePlace, GetUser } from "~/api/Query";
import type { InitialValues } from "@modular-forms/qwik";
import {
  MapPinIcon as MapPin,
  StarIcon as Star,
  WifiIcon as Wifi,
  VolumeXIcon as VolumeX,
} from "lucide-qwik";

type GeoResponse = {
  results: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    place_id: string;
    plus_code?: {
      compound_code: string;
      global_code: string;
    };
    types: string[];
  }>;
  status: string;
};

export const useFormLoader = routeLoader$<InitialValues<PlaceForm>>(() => ({
  name: "",
  address: "",
  description: "",
  image: "",
  tags: [],
  rating: "3",
  wifispeed: 0,
  hasquietenvironment: false,
  price: "",
  coordinates: [0, 0],
  category: "",
}));

type Data = ReturnType<typeof CreatePlace> extends Promise<infer T> ? T : never;

const FindLocation = server$(async function (address: string) {
  const session = this.sharedMap.get("session");
  const GEO = this.env.get("GOOGLE_GEO");
  if (!session) {
    return {
      status: "error",
      message: "No session found",
    };
  }
  const data = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?key=${GEO}&address=${address}`,
  );
  const output = (await data.json()) as GeoResponse;
  return output.results.map((el) => {
    return {
      address: el.formatted_address,
      lat: el.geometry.location.lat,
      lng: el.geometry.location.lng,
    };
  });
});
const useFormAction = formAction$<PlaceForm, Data>(async (values, event) => {
  const user = await GetUser({ event });

  if (!user) {
    return {
      status: "error",
      message: "User not found",
    };
  }
  const data = await FindLocation(values.address);
  if (!Array.isArray(data)) {
    return {
      status: "error",
      message: data.status,
    };
  }

  const result = await CreatePlace({
    event,
    userID: user.ID,
    placeData: {
      ...values,
      coordinates: [data[0].lat, data[0].lng],
    },
  });
  if (result.success) {
    return {
      status: "success",
      data: result,
    };
  }

  return {
    status: "error",
    message: result.message,
  };
}, valiForm$(placeSchema));

export default component$(() => {
  const places = useSignal<
    Array<{ address: string; lat: number; lng: number }>
  >([]);

  const nav = useNavigate();
  const [FormPlace, { Form, Field }] = useForm<PlaceForm, Data>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(placeSchema),
  });

  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      <section class="relative bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] pb-8 pt-8">
        <div class="container px-4 md:px-6">
          <div class=" mx-auto my-24 max-w-3xl">
            <div class="mb-6 flex items-center">
              <h1 class="text-3xl font-bold text-[#5B3E29]">
                Share Your Cozy Spot
              </h1>
              <span class="ml-2 inline-flex items-center justify-center rounded-full bg-[#F8D7BD] px-2.5 py-0.5 text-xs font-medium text-[#8B5A2B]">
                New
              </span>
            </div>
            <p class="mb-8 text-[#6D5D4E]">
              Help your fellow community members discover hidden gems for
              studying and relaxation
            </p>

            <div class="overflow-hidden rounded-xl border-none bg-white p-6 shadow-md md:p-8">
              <Form
                class="space-y-6"
                onSubmit$={() => {
                  if (FormPlace.submitted) {
                    nav("/places");
                  }
                }}
              >
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
                        class={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          field.error
                            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                            : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
                        }`}
                        value={field.value}
                        placeholder="e.g. Cozy Corner Cafe"
                      />
                      {field.error && (
                        <div class="mt-1 text-sm text-red-400">
                          {field.error}
                        </div>
                      )}
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
                            class={`block w-full rounded-md border bg-white px-3 py-2 pl-10 text-sm text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              field.error
                                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                                : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
                            }`}
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
                          class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D98E73] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Find
                        </button>
                      </div>
                      {field.error && (
                        <div class="mt-1 text-sm text-red-400">
                          {field.error}
                        </div>
                      )}

                      {places.value.length > 0 && (
                        <div class="mt-4 space-y-2">
                          <div class="max-h-48 overflow-y-auto rounded-md border border-[#E6D7C3] bg-[#F8EDE3]/30 p-3">
                            <div class="space-y-2">
                              {places.value.map((address, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick$={() => {
                                    field.value = address.address;
                                  }}
                                  class="w-full rounded-md border border-[#E6D7C3] bg-white p-2 text-left text-sm text-[#6D5D4E] shadow-sm transition-colors duration-150 hover:bg-[#FFF1E6] hover:shadow-md focus:border-[#D98E73] focus:bg-[#FFF1E6] active:bg-[#F8D7BD]/30"
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
                        class={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          field.error
                            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                            : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
                        }`}
                        value={field.value}
                        placeholder="Enter URL for place image"
                      />
                      {field.error && (
                        <div class="mt-1 text-sm text-red-400">
                          {field.error}
                        </div>
                      )}
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
                        class={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          field.error
                            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                            : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
                        }`}
                        rows={3}
                        value={field.value}
                        placeholder="Describe what makes this place special for studying or relaxing"
                      ></textarea>
                      {field.error && (
                        <div class="mt-1 text-sm text-red-400">
                          {field.error}
                        </div>
                      )}
                    </div>
                  )}
                </Field>

                <Field name="tags" type="string[]">
                  {(field, props) => (
                    <div>
                      <label
                        for="tags"
                        class="mb-2 block text-sm font-medium text-[#5B3E29]"
                      >
                        Tags (comma-separated)
                      </label>
                      <input
                        {...props}
                        type="text"
                        class={`block w-full rounded-md border bg-white px-3 py-2 text-sm text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          field.error
                            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                            : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
                        }`}
                        value={field.value?.join(", ")}
                        placeholder="e.g. Coffee, Quiet, WiFi, Outdoor Seating"
                      />
                      <div class="mt-2 flex flex-wrap gap-2">
                        <span class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]">
                          Coffee
                        </span>
                        <span class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]">
                          Quiet
                        </span>
                        <span class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]">
                          WiFi
                        </span>
                        <span class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]">
                          + Add more
                        </span>
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
                            class={`block w-full rounded-md border bg-white px-3 py-2 pl-10 text-sm text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              field.error
                                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                                : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
                            }`}
                            value={field.value?.toString()}
                          >
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </div>
                        {field.error && (
                          <div class="mt-1 text-sm text-red-400">
                            {field.error}
                          </div>
                        )}
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
                            class={`block w-full rounded-md border bg-white px-3 py-2 pl-10 text-sm text-[#5B3E29] ring-offset-white placeholder:text-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              field.error
                                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                                : "border-[#E6D7C3] focus:border-[#D98E73] focus:ring-[#D98E73]/20"
                            }`}
                            value={field.value?.toString()}
                            placeholder="e.g. 50"
                          />
                        </div>
                      </div>
                    )}
                  </Field>
                </div>

                <Field name="hasquietenvironment" type="boolean">
                  {(field, props) => (
                    <div class="rounded-lg bg-[#F8EDE3]/50 p-4">
                      <div class="flex items-center space-x-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8D7BD]">
                          <VolumeX class="h-5 w-5 text-[#8B5A2B]" />
                        </div>
                        <div class="flex-grow">
                          <label
                            for="hasquietenvironment"
                            class="text-sm font-medium text-[#5B3E29]"
                          >
                            Quiet Environment
                          </label>
                          <p class="text-xs text-[#6D5D4E]">
                            Is this place suitable for focused work?
                          </p>
                        </div>
                        <input
                          {...props}
                          type="checkbox"
                          class="h-5 w-5 rounded border-[#E6D7C3] text-[#D98E73] focus:ring-[#D98E73]"
                          checked={!!field.value}
                        />
                      </div>
                    </div>
                  )}
                </Field>

                <div class="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick$={() => nav("/places")}
                    class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D98E73] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D98E73] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-grow"
                  >
                    Share Your Cozy Spot
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
