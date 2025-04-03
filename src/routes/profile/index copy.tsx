import { component$, $, useStore, useSignal, useTask$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { EventCard } from "@/components/app/eventCard/EventCard";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { useQueries } from "./layout";
import { ProfileForm } from "~/components/profile";
import { getAllReferenceEvents } from "~/api/EndPoint";
import { updateProfileForm } from "~/api/Forms";

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
    <div class="w-full rounded-2xl border border-gray-300 bg-gradient-to-br from-white/80 to-gray-100/50 shadow-sm transition-all duration-300 hover:border-green-100 hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-50/70 ">
      <div class="relative flex items-center gap-6 p-8">
        <div class="relative">
          <div class="h-28 w-28 overflow-hidden rounded-full border-2 border-gray-200 shadow-sm">
            <img
              src={
                props.data?.image ||
                "https://avatars.githubusercontent.com/u/41765025?v=4"
              }
              alt="Profile picture"
              class="h-full w-full object-cover"
              width="112"
              height="112"
            />
          </div>
          <button
            onClick$={() => {
              if (props.showEdit) props.showEdit.value = !props.showEdit.value;
            }}
            class="absolute -bottom-1 -right-1 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm transition-all hover:border-green-100 hover:bg-gray-50 active:scale-95"
            aria-label="Edit profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-gray-500"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900">
            {props.data?.name}
          </h1>
          <p class="mt-1.5 text-sm leading-relaxed text-gray-600">
            {props.data?.about}
          </p>
        </div>
      </div>
      <div class="border-t border-gray-200 px-8 py-4">
        <div class="flex flex-wrap gap-2">
          {props.data?.interests.map((interest, index) => (
            <span
              key={index}
              class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10"
            >
              {interest}
            </span>
          ))}
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
    <main class="container mx-auto max-w-7xl px-4 py-8">
      <div class="flex flex-col gap-8">
        <Profile
          showEdit={showEdit}
          data={{
            name: store.name,
            about: store.about,
            interests: store.interests,
            image: data.value.userData?.Image as string,
          }}
        />

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div class="space-y-6">
            <ProfileForm
              data={store}
              active={showEdit}
              onSave={handleSaveClick}
              onChange={handleChange}
            >
              {events.value != null && events.value.length > 0 && (
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedEvents.value.slice(0, 9).map((event) => (
                    <EventCard
                      key={event.eventID}
                      title={event.name}
                      link={`/details/${event.eventID}`}
                      description={event.description}
                      image={event.image as string}
                      time={event.date}
                      attendees={event.attendees}
                      placeName={event.location}
                      placeID={event.placeId as number}
                      status={event.role}
                      tags={[]}
                    />
                  ))}
                </div>
              )}
            </ProfileForm>
          </div>

          {data.value.activeRequest != null &&
            data.value.activeRequest.length > 0 && (
              <div class="rounded-xl bg-white p-6 shadow-lg">
                <h2 class="mb-4 text-xl font-bold text-gray-900">
                  Active Requests
                </h2>
                <div class="divide-y divide-gray-100">
                  {data.value.activeRequest.map((req) => (
                    <div class="py-4 first:pt-0 last:pb-0" key={req.eventId}>
                      <Link
                        key={req.requestId}
                        href={`/profile/meet/request/${req.requestId}`}
                        class="group block rounded-xl p-4 transition-colors hover:bg-gray-50"
                      >
                        <div class="flex items-center gap-4">
                          <img
                            class="h-16 w-16 rounded-full object-cover transition-transform group-hover:scale-105"
                            src={
                              req.image ??
                              "https://images.nightcafe.studio/jobs/SU3X3xuYyIfY3Ik1BKd3/SU3X3xuYyIfY3Ik1BKd3--1--k8sy7.jpg?tr=w-1600,c-at_max"
                            }
                            width={64}
                            height={64}
                            alt={req.username ?? "User"}
                          />
                          <div>
                            <h3 class="font-medium text-gray-900 group-hover:text-blue-600">
                              {req.eventName}
                            </h3>
                            <Link
                              href={`/profile/${req.username}`}
                              class="mt-1 flex items-center text-sm text-gray-500 hover:text-blue-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="mr-1 h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                              </svg>
                              @{req.username}
                            </Link>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
});
