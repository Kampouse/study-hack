import { component$, $, useStore, useSignal, useTask$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { ProfileForm, ProfileCard } from "~/components/profile";
import { GetUser, QueryActiveEvent } from "~/helpers/query";
import { updateProfileForm } from "~/api/Forms";
import type { RequestEventLoader } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";

export const useUser = routeLoader$(async (event) => {
  return await GetUser({ event: event });
});

export const useActiveEvent = routeLoader$(
  async (event: RequestEventLoader<QwikCityPlatform>) => {
    const user = await GetUser({ event: event });
    const lst = await QueryActiveEvent({ event: event, user: user });
    console.log("lst", lst);
    return lst;
  },
);

export const useUpdateUser = routeAction$(async (data, event) => {
  try {
    return updateProfileForm(data, event);
  } catch (error) {
    console.error(error);
    return { error: "internal server error" };
  }
});

export default component$(() => {
  const userData = useUser();
  const activeEvent = useActiveEvent();
  console.log("activeEvent", activeEvent.value);
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
    </main>
  );
});
export const head: DocumentHead = {
  title: "S&H | Dashboard",
  meta: [
    {
      name: "description",
      content: "View and edit your user profile",
    },
    {
      name: "keywords",
      content: "profile, user, edit, interests",
    },
  ],
};
