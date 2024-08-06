import { component$, $, useStore } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Slot, useSignal, type Signal } from "@builder.io/qwik";
import { useUpdateUser } from "~/routes/profile";
type FormProps = {
  data: { name: string; about: string; interests: string[] };
  active: Signal<boolean>;
  onSave: (e: Event) => void;
  onChange: (e: Event) => void;
};

import { Modal } from "@qwik-ui/headless";

export default component$<FormProps>(({ data }) => {
  const output = useStore({ name: "", about: "", interests: [] });
  const onChange = $((e: Event) => {
    const { name, value } = e.target as HTMLInputElement;

    // @ts-ignore
    //data[name] = value;
    // @ts-ignore
    output[name] = value;
  });

  const action = useUpdateUser();
  const isActive = useSignal(false);

  return (
    <Modal.Root bind:show={isActive} tabIndex={-1}>
      <Slot q:slot="profile" />
      <Modal.Panel class="modal-panel  w-96 rounded-lg px-10">
        <Form
          onSubmitCompleted$={(e) => {
            if (action.value?.success) {
              isActive.value = false;
              //get current scroll position

              e.preventDefault();
              //#todo add the intrests thing here
              data.name = action.value.data?.Name || "";
              data.about = action.value.data?.Description || "";
            } else {
              console.log(action.status);
              console.log("error");
            }
          }}
          action={action}
          class="flex max-w-xl flex-col gap-4 py-2"
        >
          <div class="jus flex flex-col gap-2">
            <label for="Name" class="p-2 text-lg">
              Display name
            </label>
            <input
              class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
              type="text"
              id="Name"
              name="Name"
              value={data.name}
              onInput$={onChange}
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="Description" class="text-lg">
              About you
            </label>
            <input
              class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
              type="text"
              id="Description"
              name="Description"
              value={data.about}
              onInput$={onChange}
            />
          </div>
          <fieldset class="flex flex-col gap-2">
            <div>
              <legend class="text-lg">Interests</legend>
            </div>
            <ul class="flex flex-col gap-2 rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500">
              {data.interests.map((item, index) => {
                return (
                  <li key={index} class="grid grid-cols-2">
                    <label for={item} class="span-1">
                      {item}
                    </label>
                    <input
                      type="checkbox"
                      id={item}
                      name={item}
                      checked={data.interests.includes(item)}
                      onChange$={onChange}
                      class="span-1"
                    />
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <button
            type="submit"
            class="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
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
