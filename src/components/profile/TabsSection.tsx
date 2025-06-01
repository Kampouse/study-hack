import { component$, useSignal, $, useStore } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import type { UserProfileType } from "~/routes/profile/types";
import {
  CalendarIcon as Calendar,
  UserPlusIcon as UserPlus,
  BellIcon as Bell,
  ClockIcon as Clock,
  BookmarkIcon as Bookmark,
  UserIcon as User,
  PencilIcon as Pencil,
  CameraIcon as Camera,
  CheckIcon as Check,
  XIcon as X,
} from "lucide-qwik";
import type {
  DetailedEventType,
  PlaceType,
  ActiveRequestType,
} from "~/routes/profile/types";
import { EventCard } from "./EventCard";
import { PlaceCard } from "./PlaceCard";
import { EmptyState } from "./EmptyState";

// Profile data type

// Define props interface for ProfileView component
interface ProfileViewProps {
  profileData: UserProfileType;
  isEditing: Signal<boolean>;
}

// Profile View component
const ProfileView = component$<ProfileViewProps>(
  ({ profileData, isEditing }) => {
    return (
      <div class="flex flex-col rounded-lg bg-white p-4 shadow-sm sm:p-6 md:p-8">
        {/* Profile header with avatar and basic info */}
        <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {/* Avatar container - centered on mobile, left-aligned on desktop */}
          <div class="relative flex justify-center md:justify-start">
            <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-[#D98E73] bg-[#F8D7BD] shadow-md">
              <img
                src={profileData.avatar}
                alt="Profile avatar"
                class="h-full w-full object-cover"
                width={128}
                height={128}
                onError$={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-avatar.svg";
                }}
              />
            </div>
          </div>

          {/* Profile info container - takes remaining width */}
          <div class="flex w-full flex-1 flex-col text-center md:text-left">
            {/* Name, username and edit button */}
            <div class="flex flex-col items-center space-y-2 md:flex-row md:items-start md:justify-between md:space-y-0">
              <div>
                <h2 class="mb-1 text-2xl font-bold text-[#5B3E29]">
                  {profileData.name}
                </h2>
                <p class="text-[#D98E73]">@{profileData.username}</p>
                <p class="mt-2 text-sm text-[#6D5D4E]">
                  Member since {profileData.joinedDate}
                </p>
              </div>

              <button
                type="button"
                onClick$={() => {
                  isEditing.value = !isEditing.value;
                }}
                class="mx-auto mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:mx-0 md:mt-0"
              >
                <Pencil class="mr-2 h-4 w-4" /> Edit Profile
              </button>
            </div>

            {/* Stats cards - single column on small screens, 3 columns on larger screens */}
            <div class="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Events Attended
                </span>
              </div>
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Events Hosted
                </span>
              </div>
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Places Found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* About section */}
        <div class="mt-6 border-t border-[#F8EDE3] pt-6">
          <h3 class="mb-2 text-lg font-semibold text-[#5B3E29]">About Me</h3>
          <p class="whitespace-pre-line text-[#6D5D4E]">
            {profileData.bio || "No bio added yet."}
          </p>
        </div>

        {/* Skills section */}
        <div class="mt-6 border-t border-[#F8EDE3] pt-6">
          <h3 class="mb-3 text-lg font-semibold text-[#5B3E29]">
            Skills & Interests
          </h3>
          <div class="flex flex-wrap gap-2">
            {profileData.skills.length > 0 ? (
              profileData.skills.map((skill) => (
                <span
                  key={skill}
                  class="rounded-full bg-[#F8D7BD] px-3 py-1 text-sm text-[#8B5A2B] shadow-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p class="text-sm italic text-[#6D5D4E]">
                No skills or interests added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);
// Define props interface for ProfileEdit component
interface ProfileEditProps {
  profileData: UserProfileType;
  isEditing: Signal<boolean>;
}

// Profile Edit component
const ProfileEdit = component$<ProfileEditProps>(
  ({ profileData, isEditing }) => {
    // Local state management within the component
    const editableProfile = useStore({
      name: profileData.name,
      username: profileData.username,
      bio: profileData.bio,
      skills: [...profileData.skills],
    });

    const newSkill = useSignal("");

    // Self-contained functions
    const addSkill = $(() => {
      if (
        newSkill.value.trim() &&
        !editableProfile.skills.includes(newSkill.value.trim())
      ) {
        editableProfile.skills.push(newSkill.value.trim());
        newSkill.value = "";
      }
    });

    const removeSkill = $((skill: string) => {
      editableProfile.skills = editableProfile.skills.filter(
        (s) => s !== skill,
      );
    });

    const handleSave = $(() => {
      // Return the updated profile data to the parent component
      isEditing.value = false;
    });

    return (
      <div class="rounded-lg bg-white p-8 shadow-sm">
        <h2 class="mb-6 text-2xl font-bold text-[#5B3E29]">Edit Profile</h2>
        <div class="flex flex-col space-y-6">
          <div class="flex flex-col items-center md:flex-row md:items-start">
            <div class="relative mb-6 md:mb-0 md:mr-8">
              <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-[#D98E73] bg-[#F8D7BD]">
                <img
                  src={profileData.avatar}
                  alt="Profile avatar"
                  class="h-full w-full object-cover"
                  width={128}
                  height={128}
                  onError$={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-avatar.svg";
                  }}
                />
              </div>
              <button
                type="button"
                class="absolute bottom-0 right-0 rounded-full bg-[#D98E73] p-2 text-white shadow-md transition-colors hover:bg-[#C27B62]"
              >
                <Camera class="h-5 w-5" />
              </button>
            </div>

            <div class="flex-1 space-y-4">
              <div>
                <label class="mb-2 block font-medium text-[#5B3E29]" for="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={editableProfile.name}
                  onInput$={(e) =>
                    (editableProfile.name = (
                      e.target as HTMLInputElement
                    ).value)
                  }
                  class="w-full rounded-md border border-[#E6D7C3] bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]"
                />
              </div>

              <div>
                <label
                  class="mb-2 block font-medium text-[#5B3E29]"
                  for="username"
                >
                  Username
                </label>
                <div class="flex items-center">
                  <input
                    id="username"
                    type="text"
                    value={editableProfile.username}
                    onInput$={(e) =>
                      (editableProfile.username = (
                        e.target as HTMLInputElement
                      ).value)
                    }
                    class="w-full rounded-md border border-[#E6D7C3] bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block font-medium text-[#5B3E29]" for="bio">
              About Me
            </label>
            <textarea
              id="bio"
              value={editableProfile.bio}
              onInput$={(e) =>
                (editableProfile.bio = (e.target as HTMLTextAreaElement).value)
              }
              rows={4}
              class="w-full rounded-md border border-[#E6D7C3] bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]"
            />
          </div>

          <div>
            <label class="mb-2 block font-medium text-[#5B3E29]">
              Skills & Interests
            </label>
            <div class="mb-4 flex flex-wrap gap-2">
              {editableProfile.skills.map((skill) => (
                <div
                  key={skill}
                  class="group flex items-center rounded-full bg-[#F8D7BD] px-3 py-1"
                >
                  <span class="text-sm text-[#8B5A2B]">{skill}</span>
                  <button
                    type="button"
                    onClick$={() => removeSkill(skill)}
                    class="ml-1 rounded-full p-0.5 text-[#8B5A2B] opacity-70 transition-opacity hover:opacity-100"
                  >
                    <X class="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill or interest..."
                value={newSkill.value}
                onInput$={(e) =>
                  (newSkill.value = (e.target as HTMLInputElement).value)
                }
                onKeyUp$={(e) => {
                  if (e.key === "Enter") {
                    addSkill();
                  }
                }}
                class="flex-1 rounded-md border border-[#E6D7C3] bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]"
              />
              <button
                type="button"
                onClick$={addSkill}
                class="rounded-md bg-[#D98E73] px-4 py-2 text-white transition-colors hover:bg-[#C27B62]"
              >
                Add
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              onClick$={() => {
                isEditing.value = !isEditing.value;
              }}
              class="rounded-md border border-[#E6D7C3] bg-white px-6 py-2 text-[#6D5D4E] shadow-sm hover:bg-[#F8EDE3] focus:outline-none focus:ring-2 focus:ring-[#D98E73]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick$={handleSave}
              class="inline-flex items-center rounded-md bg-[#D98E73] px-6 py-2 text-white shadow-sm hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73]"
            >
              <Check class="mr-2 h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  },
);

interface TabsSectionProps {
  profile: UserProfileType;
  upcomingEvents: DetailedEventType[];
  hostedEvents: DetailedEventType[];
  pastEvents: DetailedEventType[];
  savedPlaces: PlaceType[];
  likedPlaces: PlaceType[];
  requests?: ActiveRequestType[];
}

export const TabsSection = component$<TabsSectionProps>(
  ({
    upcomingEvents,
    profile,
    hostedEvents,
    pastEvents,
    likedPlaces,
    requests = [],
  }) => {
    const loc = useLocation();

    const tab = loc.url.searchParams.get("tab") ?? "upcoming";
    const activeTab = useSignal(tab);
    const isEditing = useSignal(false);

    // Self-contained functions for profile editing
    // Ensure icons match IconComponent type
    const tabs: {
      id: string;
      label: string;
      icon: any;
      count: number;
    }[] = [
      {
        id: "profile",
        label: "Profile",
        icon: User,
        count: 0,
      },
      {
        id: "upcoming",
        label: "Upcoming",
        icon: Calendar,
        count: upcomingEvents.length,
      },
      {
        id: "hosted",
        label: "Hosted",
        icon: UserPlus,
        count: hostedEvents.length,
      },
      {
        id: "requests",
        label: "Requests",
        icon: Bell,
        count: requests.length,
      },

      {
        id: "liked",
        label: "Liked Places",
        icon: Bookmark,
        count: likedPlaces.length,
      },
      {
        id: "past",
        label: "Past Events",
        icon: Clock,
        count: pastEvents.length,
      },
    ];

    return (
      <div class="w-full">
        <div class="mb-8 mt-10 border-b border-[#F8EDE3] shadow-sm">
          <nav
            class="justify-left -mb-px flex space-x-8 overflow-x-auto px-4 pb-1"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              // Capture serializable values and component reference outside the JSX scope
              // to avoid potential serialization issues with the entire 'tab' object in onClick$.
              const tabId = tab.id;
              const TabIcon = tab.icon;
              const tabLabel = tab.label;
              const tabCount = tab.count;

              return (
                <Link
                  scroll={false}
                  href={"/profile?tab=" + tabId}
                  key={tabId}
                  onClick$={() => (activeTab.value = tabId)} // Use captured primitive value
                  class={`group inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
                    activeTab.value === tabId // Use captured primitive value
                      ? "border-[#D98E73] text-[#C27B62]"
                      : "border-transparent text-[#6D5D4E] hover:border-gray-300 hover:text-[#5B3E29]"
                  }`}
                  aria-current={activeTab.value === tabId ? "page" : undefined} // Use captured primitive value
                >
                  <TabIcon // Render the component directly
                    class={`mr-2 h-5 w-5 ${
                      activeTab.value === tabId // Use captured primitive value
                        ? "text-[#D98E73]"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{tabLabel}</span>
                  {tabCount > 0 && (
                    <span
                      class={`ml-2.5 hidden rounded-full px-2.5 py-1 text-xs font-semibold md:inline-block ${
                        activeTab.value === tabId // Use captured primitive value
                          ? "bg-[#FFF1E6] text-[#C27B62]"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {tabCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div class="max-w-screen-xl px-4">
          {activeTab.value === "profile" && !isEditing.value && (
            <ProfileView isEditing={isEditing} profileData={profile} />
          )}

          {activeTab.value === "profile" && isEditing.value && (
            <ProfileEdit profileData={profile} isEditing={isEditing} />
          )}

          {activeTab.value === "upcoming" &&
            (upcomingEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.eventID ?? event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="CalendarIcon" // Use conte
                title="No Upcoming Events"
                message="You haven't joined or been invited to any events yet. Explore events to join!"
              />
            ))}

          {activeTab.value === "hosted" &&
            (hostedEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {hostedEvents.map((event) => (
                  <EventCard
                    key={event.eventID ?? event.id}
                    event={event}
                    isHosted
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                context="UsersIcon" // Use context instead of icon (UserPlus mapped to UsersIcon context)
                title="No Hosted Events Yet"
                message="Ready to gather some folks? Host your first event and bring people together."
                actionButton={{ label: "Host an Event", href: "/create-event" }}
              />
            ))}

          {activeTab.value === "past" &&
            (pastEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard key={event.eventID ?? event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="CalendarIcon"
                title="No Past Events"
                message="You haven't attended any events yet. Join some events to build your history!"
                actionButton={{ label: "Find Events", href: "/events" }}
              />
            ))}
          {activeTab.value === "requests" &&
            (requests.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div>
            ) : (
              <EmptyState
                context="BellIcon" // Use Bell icon context for requests
                title="No Pending Requests"
                message="You don't have any pending requests at the moment."
              />
            ))}

          {activeTab.value === "liked" &&
            (likedPlaces.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {likedPlaces.map((place) => (
                  <PlaceCard key={place.placeId ?? place.id} place={place} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="MapPinIcon"
                title="No Liked Places"
                message="You haven't liked any places yet. Browse places and click the heart icon to add them here."
                actionButton={{ label: "Discover Places", href: "/places" }}
              />
            ))}
        </div>
      </div>
    );
  },
);
