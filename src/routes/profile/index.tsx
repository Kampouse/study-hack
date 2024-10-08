import {
  component$,
  $,
  useStore,
  useSignal,
  useTask$,
  useContext,
} from "@builder.io/qwik";
import { EventCard } from "@/components/app/eventCard/EventCard";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { queryContext } from "./layout";
import { ProfileForm, ProfileCard } from "~/components/profile";
import { getAllReferenceEvents } from "~/api/EndPoint";
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
export const useGetAllReferenceEvents = routeLoader$(async (event) => {
  return getAllReferenceEvents(event);
});

export default component$(() => {
  const events = useGetAllReferenceEvents();
  const sortedEvents = useSignal(
    events.value
      ? events.value.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
      : [],
  );

  //todo make a real time date for event thign

  console.log("hosted", events.value);
  const data = useContext(queryContext);
  console.log(data.value.activeEvent);
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
          <div class="flex flex-wrap">
            {data.value.activeRequest != null &&
              data.value.activeRequest.map((req) => (
                <Link
                  key={req.requestId}
                  href={`/profile/meet/request/${req.requestId}`}
                  class="w-fit p-2"
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
                        class="h-32 w-60 rounded-md object-cover    shadow-lg md:h-60 md:w-full "
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
          {data.value.activeEvent && data.value.activeEvent.length != 0 && (
            <h1 class="px-4 py-2 text-center text-2xl font-bold md:text-start">
              Active Events
            </h1>
          )}
          <div class="flex flex-col justify-center lg:justify-start">
            <div class="flex flex-col justify-center lg:justify-start">
              {events.value != null && events.value.length > 0 && (
                <>
                  <h2 class="mb-4 text-xl font-bold">Your Events</h2>
                  <div class="flex flex-wrap justify-center lg:justify-start">
                    {sortedEvents.value.map((event) => (
                      <div
                        key={event.eventID}
                        class="mb-4 flex w-[25em] flex-row justify-center md:justify-start lg:w-1/4 lg:pr-4"
                      >
                        <EventCard
                          title={event.name}
                          link={`/join/${event.eventID}`}
                          description={event.description}
                          time={event.date}
                          attendees={10}
                          tags={[event.host == true ? "Host" : "Attendee"]}
                          host={event.host}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
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
