import { component$, $, useStore, useSignal, useTask$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { EventCard } from "@/components/app/eventCard/EventCard";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { useQueries } from "./layout";
import { ProfileForm } from "~/components/profile";
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

type Profile = {
  showEdit?: Signal<boolean>;
  data?: {
    name: string;
    about: string;
    interests: string[];
    image?: string;
  };
};
const Profile = component$<Profile>((props) => {
  return (
    <div class=" flex">
      <div class="w-full  max-w-md overflow-hidden rounded-lg  bg-white/80  backdrop-blur">
        <div class="p-6">
          <div class="flex items-start gap-6">
            <div class="relative">
              <div class="h-24 w-24 overflow-hidden rounded-full">
                <img
                  src={
                    props.data?.image ||
                    "https://avatars.githubusercontent.com/u/41765025?v=4"
                  }
                  alt="Profile picture"
                  class="h-full w-full object-cover"
                  width="96"
                  height="96"
                />
              </div>
              <button
                onClick$={() => {
                  console.log("clicked", props.showEdit?.value);
                  if (props.showEdit)
                    props.showEdit.value = !props.showEdit.value;
                }}
                class="absolute -bottom-2 -right-2 rounded-full border bg-white p-2 shadow-sm transition-colors hover:bg-gray-50"
                aria-label="Edit profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-600"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-4">
                <h1 class="truncate text-2xl font-semibold text-gray-900">
                  {props.data?.name}
                </h1>
              </div>
              <p class="mt-1 text-sm text-gray-500">{props.data?.about}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                {props.data?.interests.map((interest, index) => (
                  <span
                    key={index}
                    class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default component$(() => {
  const showEdit = useSignal(false);
  const events = useGetAllReferenceEvents();
  const sortedEvents = useSignal(
    events.value
      ? events.value.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
      : [],
  );

  //todo make a real time date for event thign

  const data = useQueries();
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

  const handleSaveClick = $((e: Event) => {
    e.preventDefault();
    store.editMode = false;
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
    <main class="mt-10 grid grid-cols-1 gap-6 px-4 pt-4 md:grid-cols-[400px_1fr] md:px-10 md:pt-4">
      <div class=" h-fit max-w-full   md:top-4">
        <Profile
          showEdit={showEdit}
          data={{
            name: store.name,
            about: store.about,
            interests: store.interests,
            image: data.value.userData?.Image as string,
          }}
        />
        <div class="w-full">
          {data.value.activeRequest != null &&
            data.value.activeRequest.length > 0 && (
              <h2 class="mb-4 px-2 pt-5 text-xl font-bold">Active Requests</h2>
            )}
          {data.value.activeRequest != null &&
            data.value.activeRequest.map((req) => (
              <div class="w-full p-2 px-0 sm:px-2" key={req.eventId}>
                <div class="cursor-pointer rounded-2xl bg-gray-100 transition-all hover:bg-gray-200">
                  <div class="flex-grow p-4">
                    <Link
                      key={req.requestId}
                      href={`/profile/meet/request/${req.requestId}`}
                      class="block"
                    >
                      <div class="flex items-center sm:flex-row md:flex-col">
                        <img
                          class="h-20 w-20 rounded-full object-cover transition-transform hover:scale-105 sm:h-24 sm:w-24"
                          src={
                            req.image ??
                            "https://images.nightcafe.studio/jobs/SU3X3xuYyIfY3Ik1BKd3/SU3X3xuYyIfY3Ik1BKd3--1--k8sy7.jpg?tr=w-1600,c-at_max"
                          }
                          width={150}
                          height={150}
                          alt={req.username ?? "User"}
                        />
                        <div class="mt-4 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <h1 class="text-lg font-bold tracking-tight text-gray-900 transition-colors hover:text-indigo-600 sm:text-xl">
                            <span class="font-medium text-gray-600">
                              Event:
                            </span>{" "}
                            {req.eventName}
                          </h1>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div class="rounded-b-2xl bg-white p-3 transition-colors hover:bg-gray-100 sm:p-4">
                    <Link href={`/profile/${req.username}`} class="block">
                      <h1 class="flex items-center truncate text-left text-sm font-semibold text-gray-800 transition-colors hover:text-indigo-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="mr-1 h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        @{req.username}
                      </h1>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div class="">
        <ProfileForm
          data={store}
          active={showEdit}
          onSave={handleSaveClick}
          onChange={handleChange}
        >
          {/*data.value.activeEvent && data.value.activeEvent.length != 0 && (
            <h1 class="px-4 py-2 text-center text-2xl font-bold md:text-start">
              Active Events
            </h1>
          ) */}

          <div class="flex flex-col justify-center md:justify-start">
            <div class="flex flex-col justify-center md:justify-start">
              {events.value != null && events.value.length > 0 && (
                <>
                  <div class="max-w-5xl lg:flex  lg:flex-wrap  lg:justify-start">
                    {sortedEvents.value.slice(0, 8).map((event) => (
                      <div
                        key={event.eventID}
                        class="mb-4 flex w-full flex-row justify-center md:justify-start lg:w-1/4 lg:pr-4"
                      >
                        <EventCard
                          title={event.name}
                          link={`/join/${event.eventID}`}
                          description={event.description}
                          image={event.image as string}
                          time={event.date}
                          attendees={event.attendees}
                          placeID={event.placeId as number}
                          status={event.role}
                          tags={[]}
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
