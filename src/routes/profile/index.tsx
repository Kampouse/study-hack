import { component$, $, useStore, useSignal } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "~/components/leaflet-map";
import { UpdateUser } from "~/helpers/query";
import {} from "~/components/profile";
import { routeAction$ } from "@builder.io/qwik-city";
import { LocationForm, ProfileForm, ProfileCard } from "~/components/profile";
import type { User } from "~/helpers/query";

export const useUpdateUser = routeAction$(async (data, event) => {
  console.log(data);
  //todo make this validated
  const output = await UpdateUser(event, data as User);
  console.log(output);

  return {
    success: true,
    data: output,
  };
});

export default component$(() => {
  const mapStatus = useStore({
    active: false,
    when: "",
    what: "",
    where: "",
  });

  const store = useStore({
    name: "Sunflower",
    about: "Just a plant... photosynthesizing",
    interests: ["HTML", "CSS", "JavaScript", "Sunlight"],
    editMode: false,
  });
  const editMode = useSignal(false);

  const handleSaveClick = $((e: Event) => {
    e.preventDefault();
    store.editMode = false;
  });

  const handleEditClick = $(() => {
    store.editMode = true;
  });

  const handleChange = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.name === "name") {
      store.name = target.value;
    } else if (target.name === "about") {
      store.about = target.value;
    } else if (target.name === "interests") {
      if (target.checked) {
        store.interests.push(target.value);
      } else {
        store.interests = store.interests.filter(
          (item) => item !== target.value,
        );
      }
    }
  });

  const handleMapSelect = $(() => {
    mapStatus.active = true;
  });

  return (
    <main class="flex flex-col gap-10 p-16  ">
      <div>
        <ProfileForm
          data={store}
          active={editMode}
          onSave={handleSaveClick}
          onChange={handleChange}
        >
          <ProfileCard
            active={editMode}
            data={store}
            onEdit={handleEditClick}
          />
        </ProfileForm>
      </div>
      <div class={`flex flex-col gap-4 ${store.editMode ? "hidden" : "block"}`}>
        <div
          class={`flex flex-col gap-2 ${!mapStatus.active ? "block" : "hidden"}`}
        >
          <h2 class="w-fit text-3xl">Where will you be?</h2>
          <button
            class="w-fit text-xl italic underline"
            onClick$={handleMapSelect}
          >
            Press to select
          </button>
        </div>
        <div
          class={`${!mapStatus.active ? "" : "flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-10"}`}
        >
          <div
            class={`h-fit md:col-span-1 ${!mapStatus.active ? "opacity-40" : "opacity-100"}`}
          >
            <Leaflet />
          </div>
          <div
            class={`md:col-span-1 ${!mapStatus.active ? "hidden" : "block"}`}
          >
            <LocationForm
              data={{
                when: mapStatus.when,
                what: mapStatus.what,
                where: mapStatus.where,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
});
