import { component$, type QRL  } from "@builder.io/qwik";

interface ItemProps {
    name: string;
    about: string;
    onSave$: QRL<() => void>;
}

export default component$<ItemProps>(({ name, about, onSave$ }) => {
    return (
        <form onSubmit$={onSave$} class="flex flex-col gap-4 p-16">
            <div class="flex flex-col gap-2 jus">
                <label for="name" class="text-lg">Display name</label>
                <input class="p-3 bg-gray-50 border border-gray-500 text-black text-sm rounded-lg focus:border-green-500"
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                />
            </div>
            <div class="flex flex-col gap-2">
                <label for="about" class="text-lg">About you</label>
                <input  class="p-3 text-sm text-black rounded-lg bg-gray-50 border border-gray-500 focus:border-green-500"
                    type="text"
                    id="about"
                    name="about"
                    value={about}
                />
            </div>
            <button type="submit" class="self-start p-3 text-sm text-black rounded-lg bg-green-500 hover:bg-green-600">Save</button>
        </form>
    )
});