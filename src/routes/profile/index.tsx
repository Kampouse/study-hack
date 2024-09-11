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
  console.log("activeEvent", activeEvent);
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
          <div>
            <h1 class="text-2xl font-bold">Active Event</h1>
            <div class="flex flex-row gap-2">
              {activeEvent.value &&
                activeEvent.value.map((event) => (
                  <div key={event.eventID} class="flex flex-col">
                    <h2 class="text-xl font-bold"> {event.name}</h2>
                    <img
                      width={300}
                      height={300}
                      class="rounded-lg"
                      src={
                        event.image ??
                        "https://images.nightcafe.studio/jobs/SU3X3xuYyIfY3Ik1BKd3/SU3X3xuYyIfY3Ik1BKd3--1--k8sy7.jpg?tr=w-1600,c-at_max"
                      }
                      alt={event.name}
                    />
                    <p> {event.description}</p>
                  </div>
                ))}
            </div>
          </div>
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
