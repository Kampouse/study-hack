import { component$, $, useStore } from "@builder.io/qwik";
import { ProfileCard, ProfileForm } from "@/components/profile";
import { MapWrapper as Leaflet } from "~/components/leaflet-map";


export default component$(() => {

  const mapStatus = useStore({ active: false });

  const store = useStore({
    name: "Sunflower",
    about: "Just a plant... photosynthesizing",
    editMode: false,
  });

  const handleSaveClick = $(() => {
    store.editMode = false;
  });

  const handleEditClick = $(() => {
    store.editMode = true;
  });

  const handleMapSelect = $(() => {
    mapStatus.active = true;
  });

  return (
    <main class="flex flex-col">
      <div>
        {store.editMode ? (
          <ProfileForm
            name={store.name}
            about={store.about}
            onSave$={handleSaveClick}
          />
        ) : (
          <ProfileCard
            name={store.name}
            about={store.about}
            onEdit$={handleEditClick}
          />
        )}
      </div>
      <div
        class={`flex flex-col gap-4 ${!mapStatus.active ? "opacity-40" : "opactiy-100"}`}
      >
        <div class={`flex flex-col ${!mapStatus.active ? "block" : "hidden"}`}>
          <h2 class="w-fit">Where will you be?</h2>
          <button class="w-fit" onClick$={handleMapSelect}>
            Press to select
          </button>
        </div>
        <div>
          <Leaflet />
        </div>
      </div>
    </main>
  );
});
