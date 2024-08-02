import { component$, $, useStore } from "@builder.io/qwik";
import { ProfileCard, ProfileForm } from "@/components/profile";
import { MapWrapper as Leaflet } from "~/components/leaflet-map";

export default component$(() => {
  const mapStatus = useStore({ active: false });

  const store = useStore({
    name: "Sunflower",
    about: "Just a plant... photosynthesizing",
    interests: ["HTML", "CSS", "JavaScript", "Sunlight"],
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
    <main class="flex flex-col gap-10 p-16">
      <div>
        {store.editMode ? (
          <ProfileForm
            name={store.name}
            about={store.about}
            interests={store.interests}
            onSave$={handleSaveClick}
          />
        ) : (
          <ProfileCard
            name={store.name}
            about={store.about}
            interests={store.interests}
            onEdit$={handleEditClick}
          />
        )}
      </div>
      <div class="flex flex-col gap-4">
        <div class={`flex flex-col gap-2 ${!mapStatus.active ? "block" : "hidden"} ${store.editMode ? "hidden" : "block"}`}>
          <h2 class="w-fit text-3xl">Where will you be?</h2>
          <button class="w-fit text-xl underline italic" onClick$={handleMapSelect}>
            Press to select
          </button>
        </div>
        <div class={`h-fit ${!mapStatus.active ? "opacity-40" : "opacity-100"} ${store.editMode ? "hidden" : "block"}`} >
          <Leaflet />
        </div>
      </div>
    </main>
  );
});