import { component$, $, type Signal } from "@builder.io/qwik";
import { useAddUser } from "~/routes/profile";
import { Form } from "@builder.io/qwik-city";
import { Slot } from "@builder.io/qwik";
type FormProps = {
  data: { name: string; about: string; interests: string[] };
  active: Signal<boolean>;
  onSave: (e: Event) => void;
  onChange: (e: Event) => void;
};

import { Modal } from "@qwik-ui/headless";

export default component$<FormProps>(({ data }) => {
  const onChange = $((e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    // @ts-ignore
    data[name] = value;
  });

  const action = useAddUser();

  return (
    <Modal.Root>
      <Slot q:slot="profile" />
      <Modal.Panel class="modal-panel  w-96 rounded-lg px-10">
        <Form action={action} class="flex max-w-xl flex-col gap-4 py-2">
          <div class="jus flex flex-col gap-2">
            <label for="name" class="p-2 text-lg">
              Display name
            </label>
            <input
              class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
              type="text"
              id="name"
              name="name"
              value={data.name}
              onInput$={onChange}
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="about" class="text-lg">
              About you
            </label>
            <input
              class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
              type="text"
              id="about"
              name="about"
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
                      name="interests"
                      checked={data.interests.includes(item)}
                      onChange$={onChange}
                      class="span-1"
                    />
                  </li>
                );
              })}
            </ul>
          </fieldset>
          <Modal.Close
            type="submit"
            class="modal-close w-fit rounded-lg bg-green-200 p-2"
          >
            Save Changes
          </Modal.Close>
        </Form>
      </Modal.Panel>
    </Modal.Root>
  );
});

// internal
