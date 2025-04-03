import {
  component$,
  $,
  useStore,
  useSignal,
  useTask$,
  useComputed$,
  type QwikIntrinsicElements,
  type Component,
} from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  Link,
  type ActionStore,
} from "@builder.io/qwik-city";
import { useQueries } from "./layout"; // Assuming layout defines useQueries returning QueriesDataType
import { ProfileForm } from "~/components/profile"; // Assuming this component exists
import {
  getAllReferenceEvents,
  getSavedPlaces as apiGetSavedPlaces,
} from "~/api/EndPoint"; // Assuming API endpoint functions exist
import { updateProfileForm } from "~/api/Forms"; // Assuming API form functions

// --- Qwik Actions & Loaders ---

// Define the expected structure for the profile update data
// TODO: Refine this based on the actual updateProfileForm requirements
interface ProfileUpdateData {
  name: string;
  about: string;
  interests: string[]; // Assuming interests are passed as an array of strings
  // Add other fields as required by the backend API
}

// Define a more specific return type for the action result
interface UpdateUserResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>; // Assuming field errors map field names to arrays of error messages
  data?: unknown; // Optional: Add type for returned data on success if any
}

export const useUpdateUser = routeAction$<ProfileUpdateData, UpdateUserResult>(
  async (data, event) => {
    try {
      // Map frontend data structure to backend API structure
      const profileData = {
        Name: data.name,
        Description: data.about, // Assuming backend expects 'Description' for 'about'
        Interests: data.interests, // Pass interests directly
        // Add mappings for other fields
      };
      // TODO: Ensure `updateProfileForm` returns a compatible structure or adapt the mapping
      const result: UpdateUserResult = await updateProfileForm(
        profileData,
        event,
      );
      return result;
    } catch (error) {
      console.error("Error updating profile:", error);
      // Ensure the returned error structure matches UpdateUserResult
      return {
        success: false,
        error: "Failed to update profile. Please try again.",
        fieldErrors: {}, // Provide an empty object if no specific field errors
      };
    }
  },
);

// Define expected structure for raw event data from API
// TODO: Adjust based on the actual API response from getAllReferenceEvents
// This might be slightly different from DetailedEventType used for display
interface RawEventType {
  id: number;
  eventID?: number;
  name: string;
  description?: string | null;
  date: string;
  time?: string;
  location?: string | null;
  image?: string | null;
  attendees?: number | string | null; // API might return number or string
  status?: "Host" | "Confirmed" | "Pending" | string; // Allow known statuses + general string
  role?: "Host" | "Attendee" | string; // User's role
  placeId?: number | null;
  userID?: number; // Host user ID
  background?: string | null;
  experience?: string | null;
  whyJoin?: string | null;
  createdAt?: string | null;
  // If 'requests' exists in raw data and indicates pending status, keep it, but maybe typed
  requests?: unknown[] | null; // Be specific if structure is known, e.g., RequestSummaryType[]
}

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

// Define expected structure for raw place data from API
// TODO: Adjust based on the actual API response from apiGetSavedPlaces
interface RawPlaceType {
  id: number;
  placeId?: number;
  name: string;
  location: string;
  description: string;
  tags: string[];
  rating: number | string; // API might return number or string
  image?: string | null;
  visitCount: number | string; // API might return number or string
}

// Loader for Saved Places
export const useGetSavedPlaces = routeLoader$(
  async (event): Promise<PlaceType[]> => {
    try {
      const places: unknown = await apiGetSavedPlaces(event);

      if (!Array.isArray(places)) {
        console.warn("getSavedPlaces did not return an array:", places);
        return [];
      }

      // Map RawPlaceType to PlaceType, handling potential type differences
      return (places as RawPlaceType[]).map((place) => ({
        ...place,
        rating:
          typeof place.rating === "string"
            ? parseFloat(place.rating)
            : place.rating,
        visitCount:
          typeof place.visitCount === "string"
            ? parseInt(place.visitCount, 10)
            : place.visitCount,
      }));
    } catch (error) {
      console.error("Error fetching saved places:", error);
      return [];
    }
  },
);

// --- Reusable Types ---

// Type for the raw user data structure expected from the backend/layout query
type RawUserDataType = {
  ID: number;
  Name: string | null; // Allow null from backend
  Description: string | null; // Used for both username fallback and bio
  Intrests: string | string[] | null; // Handle potential typo and types
  Image: string | null; // Avatar URL
  JoinedDate: string | null; // ISO Date string or similar
  Connections: number | null; // Number of connections
  // Add other potential fields if known from the backend response
  // Example: Username?: string | null;
};

// Type for active requests displayed in the sidebar
type ActiveRequestType = {
  requestId: number | string; // Allow string if IDs aren't always numbers
  eventName?: string | null;
  username?: string | null;
  image?: string | null;
  // Add other relevant request fields if available, e.g., eventId, requestStatus
};

// Type for the data structure returned by useQueries (defined in layout.tsx presumably)
// Ensure this matches the actual return type of useQueries
type QueriesDataType = {
  userData: RawUserDataType | null;
  activeRequest: ActiveRequestType[] | null;
  // Add other potential data points returned by useQueries
};

// User profile structure used for display within this component
type UserProfileType = {
  name: string;
  username: string; // Derived or mapped from backend data
  bio: string;
  avatar?: string;
  skills: string[]; // Derived/mapped from backend 'Intrests'
  joinedDate: string; // Formatted date string
};

// More detailed Event Type for consistent use in UI components
// This might differ slightly from RawEventType if transformations are applied
type DetailedEventType = {
  id: number; // Unique identifier (use eventID or id)
  eventID?: number; // Original eventID if available
  name: string;
  description?: string | null;
  date: string; // ISO string format preferred
  time?: string; // Often derived from date
  location?: string | null;
  image?: string | null;
  attendees?: number | null; // Ensure this is a number after processing
  status?: "Host" | "Confirmed" | "Pending" | string; // Display status
  role?: "Host" | "Attendee" | string; // User's role in the event
  placeId?: number | null;
  userID?: number; // Host user ID
  // Add other fields derived or directly mapped from RawEventType if needed for display
};

// Type for Place data used within UI components
type PlaceType = {
  id: number; // Unique identifier (use placeId or id)
  placeId?: number; // Original placeId if available
  name: string;
  location: string;
  description: string;
  tags: string[];
  rating: number; // Ensure this is a number
  image?: string | null;
  visitCount: number; // Ensure this is a number
};

// Type for the stats displayed below the profile header
type StatsType = {
  upcomingEvents: number;
  hostedEvents: number;
  savedPlaces: number;
  connections: number;
};

// --- Lucide Icons ---
import {
  EditIcon as Edit,
  CalendarIcon as Calendar,
  MapPinIcon as MapPin,
  UsersIcon as Users,
  HeartIcon as Heart,
  StarIcon as Star,
  UserPlusIcon as UserPlus,
  CheckCircleIcon as CheckCircle,
  Clock3Icon as Clock3,
  InfoIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-qwik";

// Define props for Lucide icon components passed as props
type IconProps = QwikIntrinsicElements["svg"] & {
  class?: string;
  size?: number | string;
};
// Type alias for the Qwik component type representing an icon
type IconComponent = Component<IconProps>;

// --- UI Components ---

// Enhanced BetaBadge (No changes needed regarding types)
const BetaBadge = component$(() => {
  return (
    <span class="ml-2 inline-flex items-center rounded-md bg-[#FFF1E6] px-2 py-0.5 text-xs font-semibold text-[#C27B62] ring-1 ring-inset ring-[#F8D7BD]">
      Beta
    </span>
  );
});

// ProfileHeader Component (No changes needed regarding types)
const ProfileHeader = component$(
  ({
    userProfile,
    showEdit,
  }: {
    userProfile: UserProfileType;
    showEdit: Signal<boolean>;
  }) => {
    const defaultAvatar =
      "https://avatars.githubusercontent.com/u/41765025?v=4";

    return (
      <section class="relative overflow-hidden pt-10 md:pt-12">
        <div class="absolute -bottom-10 -left-10 h-72 w-72 rounded-full blur-3xl filter"></div>
        <div class="container relative z-10 px-4 pt-16 md:px-6">
          <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8 lg:gap-10">
            <div class="relative flex-shrink-0">
              <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-36 md:w-36 lg:h-40 lg:w-40">
                <img
                  src={userProfile.avatar || defaultAvatar}
                  width={160}
                  height={160}
                  alt={`${userProfile.name}'s profile picture`}
                  class="h-full w-full object-cover"
                  onError$={(e) => {
                    (e.target as HTMLImageElement).src = defaultAvatar;
                  }}
                />
              </div>
              <button
                onClick$={() => (showEdit.value = !showEdit.value)}
                class={[
                  "absolute right-0 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#D98E73] text-white shadow-md transition-all duration-200 ease-in-out hover:scale-110 hover:bg-[#C27B62] active:scale-100",
                  showEdit.value ? "bg-gray-500 hover:bg-gray-600" : "",
                ]}
                aria-label={showEdit.value ? "Cancel edit" : "Edit profile"}
                title={showEdit.value ? "Cancel edit" : "Edit profile"}
              >
                {showEdit.value ? (
                  <XIcon class="h-5 w-5" />
                ) : (
                  <Edit class="h-5 w-5" />
                )}
              </button>
            </div>
            <div class="flex-1 pt-1 text-center md:pt-2 md:text-left">
              <div class="mb-2 flex flex-col items-center justify-center gap-2 md:flex-row md:justify-start">
                <h1 class="text-3xl font-bold tracking-tight text-[#5B3E29] md:text-4xl lg:text-4xl">
                  {userProfile.name}
                </h1>
                <BetaBadge />
              </div>
              <p class="mb-4 text-base leading-relaxed text-[#6D5D4E] md:text-lg">
                {userProfile.bio || "No bio provided yet."}
              </p>
              <div class="mb-4 flex flex-wrap justify-center gap-x-2 gap-y-3 md:justify-start">
                {userProfile.skills.length > 0 ? (
                  userProfile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      class="cursor-default rounded-full bg-[#F8D7BD]/80 px-4 py-1.5 text-sm font-medium text-[#8B5A2B] transition-colors hover:bg-[#F8D7BD]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span class="text-sm italic text-[#8B5A2B]">
                    No skills listed.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

// ProfileStats Component (No changes needed regarding types)
const ProfileStats = component$(({ stats }: { stats: StatsType }) => {
  // Ensure the icons passed here match the IconComponent type implicitly
  const statItems: { label: string; value: number; icon: IconComponent }[] = [
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: Calendar },
    { label: "Hosted Events", value: stats.hostedEvents, icon: UserPlus },
    { label: "Saved Places", value: stats.savedPlaces, icon: Heart },
    { label: "Connections", value: stats.connections, icon: Users },
  ];

  return (
    <section class="container relative z-20 -mt-10 mb-10 px-4 md:px-6">
      <div class="rounded-xl bg-white p-6 shadow-lg md:p-8">
        <div class="grid grid-cols-2 gap-5 text-center md:grid-cols-4 md:gap-8">
          {statItems.map((item) => (
            <div
              key={item.label}
              class="flex flex-col items-center justify-center rounded-lg bg-[#FFF8F0]/60 p-5 transition-colors hover:bg-[#F8EDE3]/60"
            >
              <item.icon class="mb-2 h-7 w-7 text-[#D98E73]" />
              <p class="text-3xl font-bold text-[#D98E73] md:text-4xl">
                {item.value}
              </p>
              <p class="mt-1 text-sm font-medium text-[#6D5D4E]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// EventCard Component (Uses DetailedEventType, no internal `any`)
const EventCard = component$(
  ({ event, isHosted }: { event: DetailedEventType; isHosted?: boolean }) => {
    const status = isHosted ? "Host" : event.role || event.status || "Pending";

    // Add error handling for date parsing
    let displayDate = "Invalid Date";
    let displayTime = "";
    try {
      const dateTime = new Date(event.date);
      if (!isNaN(dateTime.getTime())) {
        displayDate = dateTime.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        displayTime = dateTime.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    } catch (e) {
      console.error("Failed to parse event date:", event.date, e);
    }

    const statusStyles: Record<string, string> = {
      // Use Record for better typing
      Host: "bg-[#E6F2FF] text-[#5B8CB7]",
      Confirmed: "bg-[#E8F4EA] text-[#6A9B7E]",
      Pending: "bg-[#FFF1E6] text-[#D98E73]",
      Default: "bg-gray-100 text-gray-600",
    };
    // Type assertion is okay here if `status` can be strings not in keys
    const currentStatusStyle = statusStyles[status] || statusStyles.Default;

    const statusIcons: Record<string, IconComponent> = {
      // Use Record and IconComponent type
      Host: UserPlus,
      Confirmed: CheckCircle,
      Pending: Clock3,
      Default: InfoIcon,
    };
    // Type assertion okay here
    const StatusIcon = statusIcons[status] || statusIcons.Default;

    return (
      <div class="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E6DA] bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <div class="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.image || "/placeholder-event.svg"}
            width={400}
            height={250}
            alt={`Image for ${event.name}`}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError$={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-event.svg";
            }}
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {event.location && (
            <div class="absolute left-4 top-4 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm">
              <MapPin class="mr-1.5 h-4 w-4 text-[#D98E73]" />
              <span class="truncate">{event.location}</span>
            </div>
          )}

          <div class="absolute right-4 top-4">
            <span
              class={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${currentStatusStyle}`}
            >
              <StatusIcon class="mr-1 h-4 w-4" />
              {status}
            </span>
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 class="mb-1.5 line-clamp-2 text-xl font-semibold group-hover:text-[#F8D7BD]">
              {event.name}
            </h3>
            <div class="flex items-center justify-between text-sm opacity-90">
              <div class="flex items-center gap-1.5">
                <Calendar class="h-4 w-4" />
                <span>
                  {displayDate} {displayTime ? `at ${displayTime}` : ""}
                </span>
              </div>
              {typeof event.attendees === "number" && event.attendees > 0 && (
                <div class="flex items-center gap-1">
                  <Users class="h-4 w-4" />
                  <span>{event.attendees}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div class="flex flex-1 flex-col p-5 md:p-6">
          <p class="mb-5 line-clamp-3 flex-grow text-base text-[#6D5D4E]">
            {event.description || "No description provided."}
          </p>
          <div class="mt-auto flex items-center justify-start gap-3 pt-3">
            {isHosted ? (
              <>
                <Link
                  href={`/event/edit/${event.eventID ?? event.id}`}
                  class="flex-1 whitespace-nowrap rounded-lg border border-[#D98E73]/70 px-4 py-2 text-center text-sm font-medium text-[#D98E73] transition-colors hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Edit
                </Link>
                <Link
                  href={`/event/manage/${event.eventID ?? event.id}`}
                  class="flex-1 whitespace-nowrap rounded-lg bg-[#D98E73] px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Manage
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/details/${event.eventID ?? event.id}`}
                  class="rounded-lg bg-[#D98E73] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Details
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

// PlaceCard Component (Uses PlaceType, no internal `any`)
const PlaceCard = component$(({ place }: { place: PlaceType }) => {
  const handleLikeClick = $(() => {
    console.log("Like button clicked for place:", place.id);
    // Implement like/unlike logic here
  });

  return (
    <div class="group flex flex-col overflow-hidden rounded-2xl border border-[#F0E6DA] bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
      <div class="relative aspect-[16/10] overflow-hidden">
        <img
          src={place.image || "/placeholder-place.svg"}
          width={400}
          height={250}
          alt={`Image for ${place.name}`}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError$={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-place.svg";
          }}
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <button
          onClick$={handleLikeClick}
          class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#D98E73] backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-[#C27B62] active:scale-100"
          aria-label="Save place"
          title="Save place"
        >
          <Heart class="h-5 w-5" />
        </button>
        <div class="absolute bottom-4 left-4 z-10 flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm">
          <MapPin class="mr-1.5 h-4 w-4 text-[#D98E73]" />
          {place.visitCount} {place.visitCount === 1 ? "visit" : "visits"}
        </div>
        <div class="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#5B3E29] shadow-sm backdrop-blur-sm">
          <Star class="h-4 w-4 fill-[#D98E73] text-[#D98E73]" />
          {/* Ensure rating is a number before calling toFixed */}
          <span>
            {typeof place.rating === "number" ? place.rating.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
      <div class="flex flex-1 flex-col p-5 md:p-6">
        <div class="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <MapPin class="h-4 w-4 flex-shrink-0 text-[#D98E73]" />
          <span class="truncate" title={place.location}>
            {place.location}
          </span>
        </div>
        <h3 class="mb-2 line-clamp-2 text-xl font-semibold text-[#5B3E29] group-hover:text-[#C27B62]">
          {place.name}
        </h3>
        <p class="mb-4 line-clamp-3 flex-grow text-base text-[#6D5D4E]">
          {place.description}
        </p>
        <div class="mb-5 flex flex-wrap gap-2">
          {place.tags.map((tag: string) => (
            <span
              key={tag}
              class="rounded-full bg-[#F8D7BD]/70 px-3 py-1 text-xs font-medium text-[#8B5A2B]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div class="mt-auto pt-3">
          <Link
            href={`/place/${place.placeId ?? place.id}`}
            class="block w-full rounded-lg bg-[#D98E73] px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
});

// TabsSection Component (Uses DetailedEventType and PlaceType, no internal `any`)
const TabsSection = component$(
  ({
    upcomingEvents,
    hostedEvents,
    savedPlaces,
  }: {
    upcomingEvents: DetailedEventType[];
    hostedEvents: DetailedEventType[];
    savedPlaces: PlaceType[];
  }) => {
    const activeTab = useSignal("upcoming");

    // Ensure icons match IconComponent type
    const tabs: {
      id: string;
      label: string;
      icon: IconComponent;
      count: number;
    }[] = [
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
        id: "saved",
        label: "Saved Places",
        icon: Heart,
        count: savedPlaces.length,
      },
    ];

    return (
      <div class="w-full">
        <div class="mb-8 border-b border-[#F8EDE3]">
          <nav
            class="justify-left -mb-px flex space-x-8 overflow-x-auto px-4 pb-1"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick$={() => (activeTab.value = tab.id)}
                class={`group inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
                  activeTab.value === tab.id
                    ? "border-[#D98E73] text-[#C27B62]"
                    : "border-transparent text-[#6D5D4E] hover:border-gray-300 hover:text-[#5B3E29]"
                }`}
                aria-current={activeTab.value === tab.id ? "page" : undefined}
              >
                <tab.icon
                  class={`mr-2 h-5 w-5 ${
                    activeTab.value === tab.id
                      ? "text-[#D98E73]"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    class={`ml-2.5 hidden rounded-full px-2.5 py-1 text-xs font-semibold md:inline-block ${
                      activeTab.value === tab.id
                        ? "bg-[#FFF1E6] text-[#C27B62]"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div class=" max-w-screen-xl px-4">
          {activeTab.value === "upcoming" &&
            (upcomingEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.eventID ?? event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
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
                icon={UserPlus}
                title="No Hosted Events Yet"
                message="Ready to gather some folks? Host your first event and bring people together."
                actionButton={{ label: "Host an Event", href: "/create-event" }}
              />
            ))}

          {activeTab.value === "saved" &&
            (savedPlaces.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {savedPlaces.map((place) => (
                  <PlaceCard key={place.placeId ?? place.id} place={place} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="No Saved Places"
                message="Discover and save your favorite spots to easily find them later."
                actionButton={{ label: "Browse Spaces", href: "/spaces" }} // Assuming a browse spaces route
              />
            ))}
        </div>
      </div>
    );
  },
);

// Empty State Component
const EmptyState = component$(
  ({
    icon: Icon,
    title,
    message,
    actionButton,
  }: {
    icon: any;
    title: string;
    message: string;
    actionButton?: { label: string; href: string };
  }) => {
    return (
      // Increased padding for empty state
      <div class="col-span-full py-20 text-center md:py-24">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8D7BD]/50 text-[#D98E73]">
          {" "}
          {/* Larger icon container */}
          <Icon class="h-10 w-10" /> {/* Larger icon */}
        </div>
        <h3 class="mb-3 text-2xl font-semibold text-[#5B3E29]">{title}</h3>{" "}
        {/* Larger title */}
        <p class="mx-auto mb-8 max-w-lg text-lg text-[#6D5D4E]">
          {message}
        </p>{" "}
        {/* Larger message */}
        {actionButton && (
          <Link
            href={actionButton.href}
            // Larger button padding
            class="inline-flex items-center rounded-lg bg-[#D98E73] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2 focus:ring-offset-[#FFF8F0]"
          >
            {actionButton.label}
          </Link>
        )}
      </div>
    );
  },
);

// CreateEventCTA Component with refined visuals
const CreateEventCTA = component$(() => {
  return (
    // Increased padding for CTA section
    <section class="mt-16 bg-gradient-to-b from-[#F8EDE3]/50 to-[#FFF8F0]/30 py-20 md:mt-20 md:py-24">
      <div class="container px-4 md:px-6">
        {/* Increased padding inside CTA card */}
        <div class="relative overflow-hidden rounded-2xl bg-white p-10 shadow-lg md:p-16">
          {/* Subtle background pattern */}
          <div
            class="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D98E73' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>

          <div class="relative z-10 flex flex-col items-center gap-10 md:flex-row md:gap-12">
            {" "}
            {/* Increased gap */}
            <div class="w-full md:w-1/3 lg:w-1/4">
              <div class="aspect-square overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105">
                <img
                  // Use a more relevant placeholder or actual image
                  src="/cta-placeholder.jpg"
                  width={300}
                  height={300}
                  alt="Illustration for creating an event"
                  class="h-full w-full object-cover"
                  onError$={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder.svg?text=Host+Event";
                  }}
                />
              </div>
            </div>
            <div class="flex-1 text-center md:text-left">
              <h2 class="mb-4 text-3xl font-bold text-[#5B3E29] md:text-4xl">
                {" "}
                {/* Larger title */}
                Ready to Host Your Next Session?
              </h2>
              <p class="mb-8 max-w-xl text-lg text-[#6D5D4E] lg:text-xl">
                {" "}
                {/* Larger text */}
                Create a cozy gathering at your favorite spot or discover new
                ones. Invite friends or meet new people—it's all about
                connection.
              </p>
              <div class="flex flex-wrap justify-center gap-4 md:justify-start">
                <Link
                  href="/create-event"
                  // Larger padding
                  class="inline-flex items-center justify-center rounded-lg bg-[#D98E73] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  <Calendar class="-ml-1 mr-2 h-5 w-5" /> Create an Event
                </Link>
                <Link
                  href="/spaces"
                  // Larger padding
                  class="inline-flex items-center justify-center rounded-lg border border-[#D98E73]/80 px-6 py-3 text-base font-medium text-[#D98E73] transition-colors hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  <MapPin class="-ml-1 mr-2 h-5 w-5" /> Browse Spaces
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Active Requests Sidebar Component
const ActiveRequestsSidebar = component$(
  ({ requests }: { requests: any[] }) => {
    // Use a more specific type for requests
    if (!requests || requests.length === 0) {
      return null; // Don't render if no active requests
    }

    return (
      // Increased padding for sidebar card
      <div class="space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 class="text-xl font-semibold text-[#5B3E29]">
          Active Meet Requests
        </h2>
        <div class="-mx-4 divide-y divide-[#F8EDE3]">
          {" "}
          {/* Adjusted negative margin */}
          {requests.map((req) => (
            <div class="py-4 first:pt-0 last:pb-0" key={req.requestId}>
              {" "}
              {/* Increased vertical padding */}
              <Link
                href={`/profile/meet/request/${req.requestId}`} // Ensure this route exists
                class="group block rounded-lg px-4 py-3 transition-colors hover:bg-[#FFF8F0]/80" // Adjusted padding
              >
                <div class="flex items-center gap-4">
                  <img
                    class="h-12 w-12 flex-shrink-0 rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
                    src={
                      req.image || // Use request-specific image if available
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(req.username || "User")}&background=F8D7BD&color=5B3E29` // Fallback to generated avatar
                    }
                    width={48}
                    height={48}
                    alt={
                      req.username ? `${req.username}'s avatar` : "User avatar"
                    }
                    // Add onError fallback for generated avatars too if needed
                  />
                  <div class="flex-1 overflow-hidden">
                    <h3 class="truncate font-medium text-[#5B3E29] group-hover:text-[#D98E73]">
                      {req.eventName || "Event Request"}{" "}
                      {/* Provide fallback */}
                    </h3>
                    {req.username && (
                      <span class="mt-1 flex items-center text-sm text-[#6D5D4E] group-hover:text-[#C27B62]">
                        <Users class="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span class="truncate">@{req.username}</span>
                      </span>
                    )}
                  </div>
                  <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#D98E73]" />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Optional: Add a button to view all requests if list is truncated */}
        {/* <Link href="/requests" class="mt-4 block text-center text-sm font-medium text-[#D98E73] hover:text-[#C27B62]">
             View All Requests
           </Link> */}
      </div>
    );
  },
);

// --- Main Profile Page Component ---
export default component$(() => {
  // --- Backend Data Hooks ---
  const data = useQueries(); // From layout: { userData, activeRequest, ... }
  const eventsResource = useGetAllReferenceEvents(); // Fetched reference events
  const savedPlacesResource = useGetSavedPlaces(); // Fetched saved places
  const updateUserAction = useUpdateUser(); // Action for updating profile

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
      profileStore.name = user.Name ?? "";
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
      .map((event) => ({
        // Map to DetailedEventType structure for consistency
        ...event,
        id: event.eventID ?? Math.random(), // Ensure some unique ID
        title: event.name,
        date: event.date, // Ensure date is valid ISO string
        attendees: typeof event.attendees === "number" ? event.attendees : null, // Ensure number or null
        description: event.description ?? null,
        image: event.image ?? null,
        location: event.location ?? null,
        status: event.requests ?? "Pending", // Default status
        role:
          event.role ??
          (userId !== undefined && event.userID === userId
            ? "Host"
            : "Attendee"), // Infer role if possible
      }))
      .sort((a, b) => {
        try {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
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
    return savedPlacesResource.value ?? [];
  });

  // Calculate stats based on derived data
  const stats = useComputed$(
    (): StatsType => ({
      upcomingEvents: upcomingEvents.value.length,
      hostedEvents: hostedEvents.value.length,
      savedPlaces: savedPlaces.value.length, // Use length from fetched data
      // Assuming connections are on userData - Use correct property name if different
      connections: (data.value.userData as any)?.Connections ?? 0, // Use 'as any' if Connections isn't typed, or fix type
    }),
  );

  // --- Event Handlers ---
  const handleSaveClick = $(async () => {
    // Prepare data for the action based on profileStore
    const formData = {
      name: profileStore.name,
      about: profileStore.bio, // Map store field to action field
      interests: profileStore.skills, // Map store field to action field
      // Add other fields as needed
    };
    await updateUserAction.submit(formData);
    // Optionally: check updateUserAction.value for errors/success
    // console.log("Update action result:", updateUserAction.value);
    if (
      !updateUserAction.value?.error &&
      !updateUserAction.value?.fieldErrors
    ) {
      showEdit.value = false; // Hide form on successful save
      // Maybe show a success toast notification
    } else {
      // Handle errors, potentially display them near the form fields
      console.error("Update failed:", updateUserAction.value);
    }
  });

  const handleChange = $(
    (e: Event, el: HTMLInputElement | HTMLTextAreaElement) => {
      const { name, value } = el;
      if (name === "name") {
        profileStore.name = value;
      } else if (name === "bio") {
        // Assuming form uses name="bio"
        profileStore.bio = value;
      } else if (name === "skills") {
        // Assuming skills are handled via a specific input
        // This needs specific handling based on how skills are edited (e.g., comma-separated string, tag input)
        profileStore.skills = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      // Add handling for other fields
    },
  );

  // --- User Profile Data for Display (using profileStore for consistency after load) ---
  const userProfile = useComputed$(
    (): UserProfileType => ({
      name: profileStore.name || "Loading...",
      username: profileStore.username || "...",
      bio: profileStore.bio || "No bio yet.",
      avatar: profileStore.avatar || undefined,
      skills: profileStore.skills || [],
      joinedDate: (() => {
        // Assuming JoinedDate exists on userData - fix type or use 'as any'
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
              // Assuming ProfileForm accepts these props. Adjust as needed.
              initialData={profileStore} // Pass the store as initial data
              action={updateUserAction} // Pass the Qwik action
              // onSave={handleSaveClick} // Can be handled via Form action
              // onChange={handleChange} // Can be handled via input bindings within ProfileForm
              onCancel$={() => (showEdit.value = false)} // Add a cancel handler
            />
          </section>
        )}
      </div>
      {/* Display stats based on calculated values */}
      {/* ProfileStats component is rendered inside the <section> below ProfileHeader */}
      {/* Added it back here for clarity, assuming it was accidentally removed. */}
      {/* Main Content Grid */}
      {/* Increased gap and top padding */}
      <div class="">
        {" "}
        {/* Slightly wider sidebar column */}
        {/* Left Column: Tabs Section */}
        <div class="lg:col-span-1">
          {/* Use resolved values from signals/stores */}
          <TabsSection
            upcomingEvents={upcomingEvents.value}
            hostedEvents={hostedEvents.value}
            savedPlaces={savedPlaces.value} // Use dynamic savedPlaces from loader
          />
          <ActiveRequestsSidebar requests={data.value.activeRequest} />
        </div>
        {/* Right Column: Active Requests Sidebar */}
        {/* Adjusted padding-top to align better with slightly taller tabs */}
      </div>
      {/* CTA Section */}
      <CreateEventCTA />
    </div>
  );
});
