import { component$, $, useStore, useSignal, useTask$ } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "~/components/leaflet-map";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { LocationForm, ProfileForm, ProfileCard } from "~/components/profile";
import { GetUser } from "~/helpers/query";
import { updateProfileForm, createEventForm } from "~/api/Forms";

export const useUser = routeLoader$(async (event) => {
  return await GetUser(event);
});

export const useUpdateUser = routeAction$(async (data, event) => {
  try {
    return updateProfileForm(data, event);
  } catch (error) {
    console.error(error);
    return { error: "internal server error" };
  }
});

export const useCreateEvent = routeAction$(async (data, event) => {
  try {
    return createEventForm(data, event);
  } catch (error) {
    console.error(error);
  }
});

export default component$(() => {
  const mapStatus = useStore({ active: true });

  const event = useStore({
    name: "",
    description: "",
    location: "",
    coordinates: [],
    date: "",
    startTime: "",
    endTime: "",
    tags: [],
  });

  const userData = useUser();

  const store = useStore({
    name: "Sunflower",
    about: "Just a plant... photosynthesizing",
    interests: ["HTML", "CSS", "JavaScript", "Sunlight"],
    editMode: false,
  });
  useTask$(() => {
    if (userData.value != undefined) {
      store.name = userData.value.Name;
      store.about = userData.value.Description ?? "";
    }
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
    <main class="flex flex-col md:px-10 md:pt-4 ">
      <div class="">
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
          class={`${!mapStatus.active ? "" : "flex flex-col gap-4 p-2 md:flex-row md:gap-3 "}`}
        >
          <div
            class={`md:flex-1 ${!mapStatus.active ? "opacity-40" : "opacity-100"}`}
          >
            <Leaflet />
          </div>
          <div class={"md:flex-1"}>
            <LocationForm data={event} />
          </div>
        </div>
      </div>
    </main>
  );
});
