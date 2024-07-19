import { component$, type QRL } from "@builder.io/qwik";

interface ItemProps {
  name: string;
  about: string;
  onSave$: QRL<() => void>;
}

export default component$<ItemProps>(({ name, about, onSave$ }) => {
  return (
    <form onSubmit$={onSave$} class="flex flex-col gap-4 p-16">
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
        />
      </div>
      <button
        type="submit"
        class="self-start rounded-lg bg-green-500 p-3 text-sm text-black hover:bg-green-600"
      >
        Save
      </button>
    </form>
  );
});
