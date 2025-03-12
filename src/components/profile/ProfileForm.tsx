import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Slot, type Signal } from "@builder.io/qwik";
import { useUpdateUser } from "~/routes/profile";
type FormProps = {
  data: { name: string; about: string; interests: string[] };
  active: Signal<boolean>;
  onSave: (e: Event) => void;
  onChange: (e: Event) => void;
};

import { Modal } from "@qwik-ui/headless";

export default component$<FormProps>(({ data, active }) => {
  const action = useUpdateUser();
  return (
    <Modal.Root bind:show={active} tabIndex={-1}>
      <Slot q:slot="profile" />
      <Modal.Panel class="modal-panel w-full max-w-xl rounded-2xl border border-gray-300 bg-gradient-to-br from-white/80 to-gray-100/50 p-8 shadow-sm">
        <Form
          onSubmitCompleted$={(e) => {
            if (action.value?.success) {
              active.value = false;
              e.preventDefault();
              data.name = action.value.data?.Name || "";
              data.about = action.value.data?.Description || "";
            } else {
              console.log(action.status);
              console.log("error");
            }
          }}
          action={action}
          class="flex flex-col gap-6"
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
            />
          </div>
          <div class="flex flex-col gap-4">
            <label class="text-lg font-medium text-gray-900">Interests</label>
            <div class="flex flex-wrap gap-2">
              {data.interests.map((interest, index) => (
                <span
                  key={index}
                  class="group flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                >
                  {interest}
                  <button
                    type="button"
                    class="ml-1 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                    onClick$={() => {
                      data.interests = data.interests.filter(
                        (_, i) => i !== index,
                      );
                    }}
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
                <input
                  type="text"
                  class="w-40 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400"
                  placeholder="Add interest..."
                  onKeyDown$={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      const value = input.value.trim();
                      if (value && !data.interests.includes(value)) {
                        data.interests = [...data.interests, value];
                        input.value = "";
                      }
                    }
                  }}
                  onClick$={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="mt-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {!action.value?.success && action.submitted
              ? "Saving..."
              : "Save changes"}
          </button>
        </Form>
      </Modal.Panel>
    </Modal.Root>
  );
});
