import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="mx-auto mt-8 max-w-md">
      <h2 class="mb-4 text-2xl font-bold">Add a New Location</h2>
      <form class="space-y-4">
        <div>
          <label for="name" class="mb-1 block">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            class="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label for="address" class="mb-1 block">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            class="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label for="description" class="mb-1 block">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            class="w-full rounded border px-3 py-2"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label for="tags" class="mb-1 block">
            Tags (comma-separated):
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            class="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label for="rating" class="mb-1 block">
            Rating:
          </label>
          <select
            id="rating"
            name="rating"
            class="w-full rounded border px-3 py-2"
            required
          >
            <option value="">Select a rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <button
          type="submit"
          class="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Add Location
        </button>
      </form>
    </div>
  );
});
