import { component$ } from "@builder.io/qwik";
// Removed Form import from qwik-city as action/onSubmitCompleted$ is removed
import { Slot, type Signal } from "@builder.io/qwik";

// Removed unused onSave and onChange props
type FormProps = {
  data: { name: string; about: string; interests: string[] };
  active: Signal<boolean>;
};

import { Modal } from "@qwik-ui/headless";

export default component$<FormProps>(({ data, active }) => {
  return (
    <Modal.Root bind:show={active} tabIndex={-1}>
      <Slot q:slot="profile" />
      <Modal.Panel class="modal-panel w-full max-w-xl rounded-2xl border border-gray-300 bg-gradient-to-br from-white/80 to-gray-100/50 p-8 shadow-sm">
        {/* Replaced Qwik City Form with standard form, removed action and onSubmitCompleted$ */}
        <form
          class="flex flex-col gap-6"
          // Prevent default form submission behavior which reloads the page
          preventdefault:submit
          onSubmit$={() => {
            // Optionally, add simple behavior like closing the modal here if needed
            // active.value = false;
            console.log("Form submitted (no action)");
          }}
        >
          <div class="flex flex-col gap-2">
            <label for="Name" class="text-lg font-medium text-gray-900">
              Display name
            </label>
            <input
              class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 transition-colors focus:border-green-500 focus:outline-none"
              type="text"
              id="Name"
              name="Name"
              value={data.name}
              // Removed onChange if present, keep value for display
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="Description" class="text-lg font-medium text-gray-900">
              About you
            </label>
            <input
              class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 transition-colors focus:border-green-500 focus:outline-none"
              type="text"
              id="Description"
              name="Description"
              value={data.about}
              // Removed onChange if present, keep value for display
            />
          </div>
          <div class="flex flex-col gap-4">
            <label class="text-lg font-medium text-gray-900">Interests</label>
            <div class="flex flex-wrap gap-2">
              {data.interests.map((interest, index) => (
                <span
                  key={index}
                  class="flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-300"
                >
                  {interest}
                  {/* Removed onClick$ handler from button */}
                  <button
                    type="button"
                    class="ml-1 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-4 w-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </span>
              ))}
              <div class="relative">
                {/* Removed onKeyDown$ and onClick$ handlers from input */}
                <input
                  type="text"
                  class="flex w-32 items-center rounded-full bg-gray-100 px-2.5 py-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-300"
                  placeholder="Add interest..."
                />
              </div>
            </div>
          </div>
          {/* Removed dynamic text based on action state */}
          {/* Changed to type="button" and added onClick$ to close modal */}
          <button
            type="button"
            onClick$={() => (active.value = false)}
            class="mt-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save changes
          </button>
        </form>
      </Modal.Panel>
    </Modal.Root>
  );
});
