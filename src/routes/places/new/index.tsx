import { component$ } from "@builder.io/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import type { PlaceForm } from "~/api/Forms";
import { placeSchema } from "~/api/Forms";

export default component$(() => {
  const [, { Form, Field }] = useForm<PlaceForm>({
    loader: {
      value: {
        name: "",
        address: "",
        description: "",
        image: "",
        tags: [],
        rating: 3,
        wifiSpeed: undefined,
        hasQuietEnvironment: false,
      },
    },
    validate: valiForm$(placeSchema),
  });

  return (
    <div class="mx-auto mt-8 max-w-md">
      <h2 class="mb-4 text-2xl font-bold">Add a New Location</h2>
      <Form class="space-y-4">
        <Field name="name" type="string">
          {(field, props) => (
            <div>
              <label for="name" class="mb-1 block">
                Name:
              </label>
              <input
                {...props}
                type="text"
                class="w-full rounded border px-3 py-2"
                value={field.value}
              />
              {field.error && <div class="text-red-500">{field.error}</div>}
            </div>
          )}
        </Field>
        <Field name="address" type="string">
          {(field, props) => (
            <div>
              <label for="address" class="mb-1 block">
                Address:
              </label>
              <input
                {...props}
                type="text"
                class="w-full rounded border px-3 py-2"
                value={field.value}
              />
              {field.error && <div class="text-red-500">{field.error}</div>}
            </div>
          )}
        </Field>
        <Field name="image" type="string">
          {(field, props) => (
            <div>
              <label for="image" class="mb-1 block">
                Image URL:
              </label>
              <input
                {...props}
                type="text"
                class="w-full rounded border px-3 py-2"
                value={field.value}
              />
              {field.error && <div class="text-red-500">{field.error}</div>}
            </div>
          )}
        </Field>
        <Field name="description" type="string">
          {(field, props) => (
            <div>
              <label for="description" class="mb-1 block">
                Description:
              </label>
              <textarea
                {...props}
                class="w-full rounded border px-3 py-2"
                rows={3}
                value={field.value}
              ></textarea>
              {field.error && <div class="text-red-500">{field.error}</div>}
            </div>
          )}
        </Field>
        <Field name="tags" type="string[]">
          {(field, props) => (
            <div>
              <label for="tags" class="mb-1 block">
                Tags (comma-separated):
              </label>
              <input
                {...props}
                type="text"
                class="w-full rounded border px-3 py-2"
                value={field.value?.join(", ")}
              />
            </div>
          )}
        </Field>
        <Field name="rating" type="number">
          {(field, props) => (
            <div>
              <label for="rating" class="mb-1 block">
                Rating:
              </label>
              <select
                {...props}
                class="w-full rounded border px-3 py-2"
                value={field.value?.toString()}
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              {field.error && <div class="text-red-500">{field.error}</div>}
            </div>
          )}
        </Field>
        <Field name="wifiSpeed" type="number">
          {(field, props) => (
            <div>
              <label for="wifiSpeed" class="mb-1 block">
                Wi-Fi Speed (Mbps):
              </label>
              <input
                {...props}
                type="number"
                class="w-full rounded border px-3 py-2"
                value={field.value?.toString()}
              />
            </div>
          )}
        </Field>
        <Field name="hasQuietEnvironment" type="boolean">
          {(field, props) => (
            <div class="flex items-center">
              <input
                {...props}
                type="checkbox"
                class="mr-2 h-4 w-4"
                checked={field.value}
              />
              <label for="hasQuietEnvironment">Quiet Environment</label>
            </div>
          )}
        </Field>
        <button
          type="submit"
          class="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Add Location
        </button>
      </Form>
    </div>
  );
});
