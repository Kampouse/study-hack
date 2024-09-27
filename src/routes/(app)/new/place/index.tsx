import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <Form class="space-y-4">
      <div class="flex flex-col gap-2">
        <label for="locationName" class="text-lg font-medium">
          Location Name
        </label>
        <input
          type="text"
          id="locationName"
          name="locationName"
          class="rounded-lg border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
          placeholder="e.g. Sunny Beach Café"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="address" class="text-lg font-medium">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          class="rounded-lg border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
          placeholder="123 Remote Work St, Digital City"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="description" class="text-lg font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          class="rounded-lg border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
          placeholder="What makes this spot great for remote work?"
        ></textarea>
      </div>
      <div class="flex flex-col gap-2">
        <label for="wifiSpeed" class="text-lg font-medium">
          Wi-Fi Speed
        </label>
        <input
          type="number"
          id="wifiSpeed"
          name="wifiSpeed"
          class="rounded-lg border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
          placeholder="Mbps"
        />
      </div>
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="quietEnvironment"
          name="quietEnvironment"
          class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label for="quietEnvironment" class="text-sm font-medium">
          Quiet Environment
        </label>
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Submit Cool Location
      </button>
    </Form>
  );
});
