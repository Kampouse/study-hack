import {
  component$,
  useStore,
  useSignal,
  useTask$,
  useComputed$,
} from "@builder.io/qwik";

// --- Routing & Data Fetching ---
import { routeLoader$ } from "@builder.io/qwik-city";
// --- Layout & API Imports ---
import { useQueries } from "./layout"; // Assuming layout defines useQueries returning QueriesDataType
import { ProfileForm } from "~/components/profile"; // Assuming this component exists
import { getAllReferenceEvents } from "~/api/EndPoint"; // Assuming API endpoint functions exist
// --- Type Definitions ---
import type {
  // RawUserDataType, // Keep if needed elsewhere, otherwise remove if unused
  UserProfileType,
  RawEventType,
  DetailedEventType,
} from "./types";

// --- UI Components ---
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TabsSection } from "@/components/profile/TabsSection";
import { CreateEventCTA } from "@/components/profile/CreateEventCTA";
import { ActiveRequestsSidebar } from "@/components/profile/ActiveRequestsSidebar";

// --- Qwik Actions & Loaders ---

export const useGetAllReferenceEvents = routeLoader$(
  async (event): Promise<RawEventType[]> => {
    try {
      // Assume getAllReferenceEvents returns RawEventType[] or something castable
      const events: unknown = await getAllReferenceEvents(event);

      // Add runtime validation
      if (!Array.isArray(events)) {
        console.warn("getAllReferenceEvents did not return an array:", events);
        return [];
      }
      // TODO: Add more robust validation here if needed (e.g., using zod)
      // For now, we cast, assuming the API is somewhat reliable
      return events as RawEventType[];
    } catch (error) {
      console.error("Error fetching reference events:", error);
      return []; // Return empty array on error
    }
  },
);

// Loader for Saved Places

// --- Lucide Icons ---
export default component$(() => {
  // --- Backend Data Hooks ---
  const data = useQueries(); // From layout: { userData, activeRequest, ... }
  const eventsResource = useGetAllReferenceEvents(); // Fetched reference events

  // --- State Signals and Stores ---
  console.log(data.value.activeRequest);
  const showEdit = useSignal(false);
  const profileStore = useStore({
    name: "",
    username: "", // Needs to be populated if username is distinct from description
    bio: "",
    skills: [] as string[],
    avatar: "", // To potentially handle avatar updates
  });

  // --- Effects ---
  // Task to initialize the profile edit store when userData is available
  useTask$(({ track }) => {
    track(() => data.value.userData); // Rerun when userData changes

    const user = data.value.userData;
    if (user) {
      profileStore.name = user.Name;
      // Assuming Username might exist, otherwise fallback to something else or leave blank
      // profileStore.username = user.Username ?? user.Name?.toLowerCase().replace(/\s+/g, '') ?? "";
      profileStore.username = user.Description ?? "user"; // Fallback using Description if no Username
      profileStore.bio = user.Description ?? ""; // Using Description for Bio
      // Backend seems to use 'Intrests' (typo?) - handle potential string or array format
      profileStore.skills =
        typeof user.Intrests === "string"
          ? user.Intrests.split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : Array.isArray(user.Intrests)
            ? user.Intrests
            : [];
      profileStore.avatar = user.Image ?? "";
    }
  });

  // --- Derived Data ---
  const allEvents = useComputed$(() => {
    const rawEvents = eventsResource.value;

    const userId = data.value.userData?.ID;
    // Add robust date parsing and type checking/casting
    return rawEvents
      .map(
        (event): DetailedEventType => ({
          // Ensure the mapped object matches DetailedEventType
          // Map to DetailedEventType structure for consistency
          ...event, // Spread existing RawEvent properties
          id: event.eventID ?? Math.random(), // Ensure some unique string ID (UUID preferred)
          eventID: event.eventID,
          name: event.name,
          date: event.date, // Ensure date is valid ISO string
          attendees:
            typeof event.attendees === "number" ? event.attendees : null, // Ensure number or null
          description: event.description ?? null,
          image: event.image ?? null,
          location: event.location ?? null,
          role:
            event.role ??
            (userId !== undefined && event.userID === userId
              ? "Host"
              : "Attendee"), // Infer role if possible
        }),
      )
      .sort((a, b) => {
        try {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0; // Don't sort invalid dates relative to others
          return dateA.getTime() - dateB.getTime();
        } catch (e) {
          console.error("Invalid date found during sorting:", a.date, b.date);
          return 0; // Handle invalid dates
        }
      });
  });

  const hostedEvents = useComputed$(() =>
    allEvents.value.filter((event) => event.role === "Host"),
  );
  const upcomingEvents = useComputed$(() =>
    allEvents.value.filter((event) => event.role !== "Host"),
  ); // Assuming upcoming means events user attends

  // Saved places from the routeLoader
  const savedPlaces = useComputed$(() => {
    return [];
  });

  const userProfile = useComputed$(
    (): UserProfileType => ({
      name: profileStore.name || "Loading...",
      username: profileStore.username || "...",
      bio: profileStore.bio || "No bio yet.",
      avatar: profileStore.avatar || undefined,
      skills: profileStore.skills || [],
      joinedDate: (() => {
        // Assuming JoinedDate exists on userData - Cast if necessary
        const joinedDateStr = (data.value.userData as any)?.JoinedDate;
        if (!joinedDateStr) return "Recently";
        try {
          return new Date(joinedDateStr).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
          });
        } catch {
          return "Recently"; // Fallback for invalid date
        }
      })(),
      // Ensure all required UserProfileType fields are present
    }),
  );

  return (
    // Keep the main background color, the warmth is part of the theme
    <div class="min-h-screen bg-[#FFF8F0] pb-16 md:pb-20">
      {" "}
      {/* Increased bottom padding */}
      {/* Pass profile data and edit signal */}
      <ProfileHeader userProfile={userProfile.value} showEdit={showEdit} />
      {/* Conditionally render ProfileForm with transition */}
      {/* Add a container for positioning and potential animations */}
      <div
        // Increased padding when shown
        class={`container px-4 transition-all duration-300 ease-in-out md:px-6 ${showEdit.value ? "max-h-[1000px] py-10 opacity-100" : "max-h-0 overflow-hidden py-0 opacity-0"}`}
      >
        {showEdit.value && (
          <section>
            {/* Pass necessary props to ProfileForm */}
            <ProfileForm
              data={{
                name: userProfile.value.name,
                interests: userProfile.value.skills,
                about: userProfile.value.bio,
              }}
              active={showEdit}
            />
          </section>
        )}
      </div>
      <div class="">
        <div class="lg:col-span-1">
          {/* Use resolved values from signals/stores */}
          <TabsSection
            upcomingEvents={upcomingEvents.value}
            hostedEvents={hostedEvents.value}
            savedPlaces={savedPlaces.value} // Use dynamic savedPlaces from loader
          />

          {data.value.activeRequest && data.value.activeRequest.length > 0 && (
            <div class="mt-8 lg:mt-0 lg:pl-8">
              {" "}
              {/* Add margin top for spacing */}
              <ActiveRequestsSidebar requests={data.value.activeRequest} />
            </div>
          )}
        </div>
      </div>
      <CreateEventCTA />
    </div>
  );
});
