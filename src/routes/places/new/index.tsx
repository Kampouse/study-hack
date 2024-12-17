import { component$, useSignal } from "@qwik.dev/core";
import { useForm, valiForm$, formAction$ } from "@modular-forms/qwik";
import type { PlaceForm } from "~/api/Forms";
import { placeSchema } from "~/api/Forms";
import { routeLoader$ } from "@qwik.dev/router";
import { useNavigate, server$ } from "@qwik.dev/router";
import { CreatePlace, GetUser } from "~/api/Query";
import type { InitialValues } from "@modular-forms/qwik";

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
  wifiSpeed: 0,
  hasQuietEnvironment: false,
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
      rating: parseInt(values.rating),
      placeId: 0,
      lat: data[0].lat,
      lng: data[0].lng,
    },
  });
  console.log(result);
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
    <div class="mx-auto mt-8 max-w-md rounded-lg border-2 border-gray-300 bg-white p-8 shadow-lg">
      <h2 class="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
        Add a New Location
      </h2>
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
                class="mb-2 block text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                {...props}
                type="text"
                class={`block w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  field.error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                }`}
                value={field.value}
              />
              {field.error && (
                <div class="mt-1 text-sm text-red-400">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="address" type="string">
          {(field, props) => (
            <div>
              <label
                for="address"
                class="mb-2 block text-sm font-medium text-gray-900"
              >
                Address
              </label>

              <div class="flex gap-2">
                <input
                  {...props}
                  type="text"
                  class={`block w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    field.error
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                  }`}
                  value={field.value}
                />
                <button
                  type="button"
                  onClick$={async () => {
                    const output = await FindLocation(field.value as string);
                    if (Array.isArray(output)) {
                      places.value = output;
                    }
                  }}
                  class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Find
                </button>
              </div>
              {field.error && (
                <div class="mt-1 text-sm text-red-400">{field.error}</div>
              )}

              <div class="mt-4 space-y-2">
                <div class="max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3">
                  <div class="space-y-2">
                    {places.value.map((address, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick$={() => {
                          field.value = address.address;
                        }}
                        class="w-full rounded-md border border-gray-200 bg-white p-2 text-left text-sm text-gray-500 shadow-sm transition-colors duration-150 hover:bg-gray-50 hover:shadow-md focus:border-blue-300 focus:bg-blue-50 active:bg-blue-100"
                      >
                        {address.address}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Field>
        <Field name="image" type="string">
          {(field, props) => (
            <div>
              <label
                for="image"
                class="mb-2 block text-sm font-medium text-gray-900"
              >
                Image URL
              </label>
              <input
                {...props}
                type="text"
                class={`block w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  field.error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                }`}
                value={field.value}
              />
              {field.error && (
                <div class="mt-1 text-sm text-red-400">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="description" type="string">
          {(field, props) => (
            <div>
              <label
                for="description"
                class="mb-2 block text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                {...props}
                class={`block w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  field.error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                }`}
                rows={3}
                value={field.value}
              ></textarea>
              {field.error && (
                <div class="mt-1 text-sm text-red-400">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="tags" type="string[]">
          {(field, props) => (
            <div>
              <label
                for="tags"
                class="mb-2 block text-sm font-medium text-gray-900"
              >
                Tags (comma-separated)
              </label>
              <input
                {...props}
                type="text"
                class={`block w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  field.error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                }`}
                value={field.value?.join(", ")}
              />
            </div>
          )}
        </Field>
        <Field name="rating" type="string">
          {(field, props) => (
            <div>
              <label
                for="rating"
                class="mb-2 block text-sm font-medium text-gray-900"
              >
                Rating
              </label>
              <select
                {...props}
                class={`block w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  field.error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                }`}
                value={field.value?.toString()}
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              {field.error && (
                <div class="mt-1 text-sm text-red-400">{field.error}</div>
              )}
            </div>
          )}
        </Field>
        <Field name="wifiSpeed" type="number">
          {(field, props) => (
            <div>
              <label
                for="wifiSpeed"
                class="mb-2 block text-sm font-medium text-gray-900"
              >
                Wi-Fi Speed (Mbps)
              </label>
              <input
                {...props}
                type="number"
                class={`block w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  field.error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                }`}
                value={field.value?.toString()}
              />
            </div>
          )}
        </Field>
        <Field name="hasQuietEnvironment" type="boolean">
          {(field, props) => (
            <div class="flex items-center space-x-2">
              <input
                {...props}
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                checked={field.value}
              />
              <label
                for="hasQuietEnvironment"
                class="text-sm font-medium text-gray-900"
              >
                Quiet Environment
              </label>
            </div>
          )}
        </Field>
        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Add Location
        </button>
      </Form>
    </div>
  );
});
