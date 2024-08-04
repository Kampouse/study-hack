import { component$, type QRL, $ } from "@builder.io/qwik";

interface ItemProps {
  name: string;
  about: string;
  interests: string[];
  onSave$: QRL<() => void>;
  onChange$: QRL<(e: Event) => void>;
}

export default component$<ItemProps>(({ name, about, interests, onSave$, onChange$ }) => {
  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    onSave$();
  });
  return (
    <form onSubmit$={handleSubmit} class="flex flex-col gap-4 max-w-xl">
      <div class="jus flex flex-col gap-2">
        <label for="name" class="text-lg">
          Display name
        </label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="name"
          name="name"
          value={name}
          onInput$={onChange$}
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
          value={about}
          onInput$={onChange$}
        />
      </div>
      <fieldset class="flex flex-col gap-2">
        <div><legend class="text-lg">Interests</legend></div>
        <ul class="flex flex-col gap-2 rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500">
          {interests.map((item, index) => {
            return (
              <li key={index} class="grid grid-cols-2">
                <label for={item} class="span-1">{item}</label>
                <input type="checkbox" id={item} name="interests" class="span-1" />
              </li>
            )
          })}
        </ul>
      </fieldset>
      <button
        type="submit"
        class="self-start rounded-lg bg-green-500 p-3 text-sm text-black hover:bg-[#90EE90]"
      >
        Save
      </button>
    </form>
  );
});
