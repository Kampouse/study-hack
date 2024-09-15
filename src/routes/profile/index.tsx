import {
  component$,
  $,
  useStore,
  useSignal,
  useTask$,
  useContext,
} from "@builder.io/qwik";
import { routeAction$ } from "@builder.io/qwik-city";
import { queryContext } from "./layout";
import { ProfileForm, ProfileCard } from "~/components/profile";
import {} from "~/api/Query";
import { updateProfileForm } from "~/api/Forms";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
export const useUpdateUser = routeAction$(async (data, event) => {
  try {
    return updateProfileForm(data, event);
  } catch (error) {
    console.error(error);
    return { error: "internal server error" };
  }
});

export default component$(() => {
  const data = useContext(queryContext);
  const store = useStore({
    name: "Sunflower",
    about: "Just a plant... photosynthesizing",
    interests: ["HTML", "CSS", "JavaScript", "Sunlight"],
    editMode: false,
  });
  useTask$(() => {
    if (data.value.userData != undefined) {
      store.name = data.value.userData.Name;
      store.about = data.value.userData.Description ?? "";
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
            <h1 class="px-4 py-2 text-2xl font-bold">Active Request</h1>

            <div class="flex flex-wrap  px-4">
              {data.value.activeRequest != null &&
                data.value.activeRequest.map((req) => (
                  <Link
                    key={req.requestId}
                    href={`/profile/meet/${req.requestId}`}
                    class="w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4"
                  >
                    <div class="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm">
                      <div class="p-4">
                        <h2 class="truncate text-lg font-bold">
                          {" "}
                          {req.eventName}
                        </h2>
                      </div>
                      <div class="flex-grow">
                        <img
                          class="h-48 w-full  rounded-md object-cover "
                          src={
                            req.image ??
                            "https://images.nightcafe.studio/jobs/SU3X3xuYyIfY3Ik1BKd3/SU3X3xuYyIfY3Ik1BKd3--1--k8sy7.jpg?tr=w-1600,c-at_max"
                          }
                          width={300}
                          height={300}
                          alt={req.username ?? "User"}
                        />
                      </div>
                      <div class="bg-gray-50 p-4">
                        <h1 class="truncate text-left text-sm font-semibold text-gray-800">
                          @{req.username}
                        </h1>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            <h1 class="px-4 pt-2 text-2xl font-bold">Active Events</h1>
            <div class=" flex  flex-col gap-2 py-2 md:flex-row">
              {data.value.activeEvent &&
                data.value.activeEvent.map((event) => (
                  <div key={event.eventID} class=" flex flex-col">
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

      <h1 class="px-4 pt-2 text-2xl font-bold">Confirmed Requests</h1>
      <div class="flex flex-row gap-2 px-4">
        {data.value.completedRequest != null &&
          data.value.completedRequest
            .filter((req) => req.requestStatus === "confirmed")
            .map((req) => (
              <Link key={req.requestId} href={`/profile/meet/${req.requestId}`}>
                <div class="flex flex-col">
                  <h2 class="px-2 text-lg font-bold">{req.eventName}</h2>
                  <img
                    width={250}
                    height={250}
                    class="rounded-lg"
                    src={
                      req.eventImg ??
                      "https://images.nightcafe.studio/jobs/SU3X3xuYyIfY3Ik1BKd3/SU3X3xuYyIfY3Ik1BKd3--1--k8sy7.jpg?tr=w-1600,c-at_max"
                    }
                  />
                  <div class="flex flex-row gap-2 px-1">
                    <h1>Status -&gt; {req.requestStatus}</h1>
                  </div>
                </div>
              </Link>
            ))}
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
