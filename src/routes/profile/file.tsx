import { component$, useSignal } from "@builder.io/qwik";

// Define reusable types
type UserProfileType = {
  name: string;
  username: string;
  bio: string;
  avatar?: string;
  skills: string[];
  joinedDate: string;
};

type EventType = {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  status: "Host" | "Confirmed" | "Pending";
  description: string;
  image?: string;
};

type PlaceType = {
  id: number;
  name: string;
  location: string;
  description: string;
  tags: string[];
  rating: number;
  image?: string;
  visitCount: number;
};

type StatsType = {
  upcomingEvents: number;
  hostedEvents: number;
  savedPlaces: number;
  connections: number;
};

// Removed the custom Button component as requested

// Import Lucide icons from lucid-qwik
import {
  EditIcon as Edit,
  SettingsIcon as Settings,
  LogOutIcon as LogOut,
  CalendarIcon as Calendar,
  MapPinIcon as MapPin,
  UsersIcon as Users,
  HeartIcon as Heart,
  StarIcon as Star,
  UserPlusIcon as UserPlus,
  CheckCircleIcon as CheckCircle,
  Clock3Icon as Clock3,
} from "lucide-qwik";
// BetaBadge Component
const BetaBadge = component$(() => {
  return (
    <span class="inline-flex items-center rounded-full bg-[#FFF1E6] px-2 py-1 text-xs font-medium text-[#D98E73]">
      Beta
    </span>
  );
});

// ProfileHeader Component
const ProfileHeader = component$(
  ({ userProfile }: { userProfile: UserProfileType }) => {
    return (
      <section class="relative bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] pb-12 pt-8">
        <div class="absolute right-10 top-20 h-64 w-64 rounded-full bg-[#F8D7BD] opacity-20 blur-3xl"></div>
        <div class="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-[#A7D7E8] opacity-20 blur-3xl"></div>
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div class="relative">
              <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md md:h-40 md:w-40">
                <img
                  src={userProfile.avatar || "/placeholder.svg"}
                  width={160}
                  height={160}
                  alt={userProfile.name}
                  class="h-full w-full object-cover"
                />
              </div>
              <button class="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#D98E73] p-0 text-white hover:bg-[#C27B62]">
                <Edit class="h-4 w-4" />
              </button>
            </div>
            <div class="flex-1 text-center md:text-left">
              <div class="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
                <h1 class="text-3xl font-bold text-[#5B3E29]">
                  {userProfile.name}
                </h1>
                <BetaBadge />
              </div>
              <p class="mb-3 text-[#6D5D4E]">
                {userProfile.username} · Joined {userProfile.joinedDate}
              </p>
              <p class="mb-4 max-w-2xl text-[#6D5D4E]">{userProfile.bio}</p>
              <div class="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {userProfile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    class="rounded bg-[#F8D7BD] px-3 py-1 text-[#8B5A2B] hover:bg-[#F0C9A8]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div class="flex gap-2">
              <button class="rounded border border-[#D98E73] px-4 py-2 text-[#D98E73] hover:bg-[#FFF1E6]">
                <Settings class="mr-2 h-4 w-4" />
                Settings
              </button>
              <button class="rounded border border-[#D98E73] px-4 py-2 text-[#D98E73] hover:bg-[#FFF1E6]">
                <LogOut class="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

// ProfileStats Component
const ProfileStats = component$(({ stats }: { stats: StatsType }) => {
  return (
    <section class="container -mt-6 mb-8 px-4 md:px-6">
      <div class="rounded-xl bg-white p-6 shadow-md">
        <div class="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div class="p-4">
            <p class="text-3xl font-bold text-[#D98E73]">
              {stats.upcomingEvents}
            </p>
            <p class="text-[#6D5D4E]">Upcoming Events</p>
          </div>
          <div class="p-4">
            <p class="text-3xl font-bold text-[#D98E73]">
              {stats.hostedEvents}
            </p>
            <p class="text-[#6D5D4E]">Hosted Events</p>
          </div>
          <div class="p-4">
            <p class="text-3xl font-bold text-[#D98E73]">{stats.savedPlaces}</p>
            <p class="text-[#6D5D4E]">Saved Places</p>
          </div>
          <div class="p-4">
            <p class="text-3xl font-bold text-[#D98E73]">{stats.connections}</p>
            <p class="text-[#6D5D4E]">Connections</p>
          </div>
        </div>
      </div>
    </section>
  );
});

// EventCard Component
const EventCard = component$(
  ({ event, isHosted }: { event: EventType; isHosted?: boolean }) => {
    return (
      <div class="overflow-hidden rounded-xl border-none shadow-md transition-shadow hover:shadow-lg">
        <div class="relative aspect-[4/3]">
          <img
            src={event.image || "/placeholder.svg"}
            width={400}
            height={300}
            alt={event.title}
            class="h-full w-full object-cover"
          />
          <div class="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-black/10 to-black/60"></div>
          <div class="absolute left-3 top-3">
            <div class="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#5B3E29]">
              <MapPin class="mr-1 inline h-3 w-3" />
              {event.location}
            </div>
          </div>
          <div class="absolute right-3 top-3">
            <span
              class={`rounded px-3 py-1 ${
                event.status === "Host"
                  ? "bg-[#E6F2FF] text-[#5B8CB7]"
                  : event.status === "Confirmed"
                    ? "bg-[#E8F4EA] text-[#6A9B7E]"
                    : "bg-[#F8D7BD] text-[#8B5A2B]"
              }`}
            >
              {event.status === "Host" && (
                <UserPlus class="mr-1 inline h-3 w-3" />
              )}
              {event.status === "Confirmed" && (
                <CheckCircle class="mr-1 inline h-3 w-3" />
              )}
              {event.status === "Pending" && (
                <Clock3 class="mr-1 inline h-3 w-3" />
              )}
              {event.status}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 p-3 shadow-sm backdrop-blur-sm">
            <h3 class="mb-1 font-semibold text-[#5B3E29]">{event.title}</h3>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-[#6D5D4E]">
                <Calendar class="h-3 w-3 text-[#D98E73]" />
                <span>
                  {event.date} at {event.time}
                </span>
              </div>
              <div class="flex items-center gap-1 text-sm text-[#6D5D4E]">
                <Users class="h-3 w-3 text-[#D98E73]" />
                <span>{event.attendees}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4">
          <p class="line-clamp-2 text-sm text-[#6D5D4E]">{event.description}</p>
          <div class="mt-4 flex items-center justify-between">
            {isHosted ? (
              <>
                <button class="rounded border border-[#D98E73] px-4 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6]">
                  Edit Event
                </button>
                <button class="rounded bg-[#D98E73] px-4 py-2 text-sm text-white hover:bg-[#C27B62]">
                  Manage Guests
                </button>
              </>
            ) : (
              <>
                {event.status === "Pending" ? (
                  <span class="rounded border border-[#D98E73] px-3 py-1 text-[#D98E73]">
                    Awaiting Confirmation
                  </span>
                ) : (
                  <span class="rounded border border-[#6A9B7E] px-3 py-1 text-[#6A9B7E]">
                    {event.status === "Host" ? "You're Hosting" : "Confirmed"}
                  </span>
                )}
                <button class="rounded bg-[#D98E73] px-4 py-2 text-sm text-white hover:bg-[#C27B62]">
                  View Details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

// PlaceCard Component
const PlaceCard = component$(({ place }: { place: PlaceType }) => {
  return (
    <div class="group overflow-hidden rounded-xl border-none shadow-md transition-shadow hover:shadow-lg">
      <div class="relative aspect-[4/3] overflow-hidden">
        <img
          src={place.image || "/placeholder.svg"}
          width={400}
          height={300}
          alt={place.name}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button class="absolute right-3 top-3 rounded-full bg-white/90 p-0 text-[#D98E73] hover:bg-white">
          <Heart class="h-5 w-5 fill-[#D98E73]" />
        </button>
        <div class="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#5B3E29]">
          <MapPin class="mr-1 inline h-3 w-3" />
          {place.visitCount} visits
        </div>
      </div>
      <div class="bg-white p-5">
        <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin class="h-4 w-4 text-[#D98E73]" />
          <span class="truncate">{place.location}</span>
        </div>
        <h3 class="mb-1 text-lg font-semibold text-[#5B3E29]">{place.name}</h3>
        <p class="mb-3 line-clamp-2 text-sm text-[#6D5D4E]">
          {place.description}
        </p>
        <div class="mb-3 flex flex-wrap gap-2">
          {place.tags.map((tag: string) => (
            <span
              key={tag}
              class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div class="flex items-center justify-between">
          <button class="rounded border border-[#D98E73] px-4 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6]">
            View Details
          </button>
          <div class="flex items-center gap-1">
            <Star class="h-4 w-4 fill-[#D98E73] text-[#D98E73]" />
            <span class="font-medium text-[#5B3E29]">{place.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// TabsSection Component
const TabsSection = component$(
  ({
    upcomingEvents,
    hostedEvents,
    savedPlaces,
  }: {
    upcomingEvents: EventType[];
    hostedEvents: EventType[];
    savedPlaces: PlaceType[];
  }) => {
    const activeTab = useSignal("upcoming");

    return (
      <section class="container px-4 py-8 md:px-6">
        <div class="w-full">
          <div class="mb-8 flex gap-2 overflow-x-auto rounded-lg bg-[#F8EDE3] p-1">
            <button
              onClick$={() => (activeTab.value = "upcoming")}
              class={`whitespace-nowrap rounded-lg px-6 py-2 text-[#6D5D4E] transition-colors ${
                activeTab.value === "upcoming"
                  ? "bg-white text-[#5B3E29] shadow-sm"
                  : "hover:bg-white/50"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick$={() => (activeTab.value = "hosted")}
              class={`whitespace-nowrap rounded-lg px-6 py-2 text-[#6D5D4E] transition-colors ${
                activeTab.value === "hosted"
                  ? "bg-white text-[#5B3E29] shadow-sm"
                  : "hover:bg-white/50"
              }`}
            >
              Hosted Events
            </button>
            <button
              onClick$={() => (activeTab.value = "saved")}
              class={`whitespace-nowrap rounded-lg px-6 py-2 text-[#6D5D4E] transition-colors ${
                activeTab.value === "saved"
                  ? "bg-white text-[#5B3E29] shadow-sm"
                  : "hover:bg-white/50"
              }`}
            >
              Saved Places
            </button>
          </div>

          {activeTab.value === "upcoming" && (
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event: EventType) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {activeTab.value === "hosted" && (
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hostedEvents.length > 0 ? (
                hostedEvents.map((event: EventType) => (
                  <EventCard key={event.id} event={event} isHosted />
                ))
              ) : (
                <div class="col-span-full py-12 text-center">
                  <div class="mx-auto mb-4 w-fit rounded-full bg-[#F8D7BD] p-6">
                    <Calendar class="h-8 w-8 text-[#D98E73]" />
                  </div>
                  <h3 class="mb-2 text-xl font-semibold text-[#5B3E29]">
                    No Hosted Events Yet
                  </h3>
                  <p class="mx-auto mb-6 max-w-md text-[#6D5D4E]">
                    You haven't hosted any events yet. Create your first event
                    and invite others to join you!
                  </p>
                  <button class="rounded bg-[#D98E73] px-4 py-2 text-white hover:bg-[#C27B62]">
                    Host an Event
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab.value === "saved" && (
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {savedPlaces.map((place: PlaceType) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  },
);

// CreateEventCTA Component
const CreateEventCTA = component$(() => {
  return (
    <section class="mt-8 bg-[#F8EDE3] py-12">
      <div class="container px-4 md:px-6">
        <div class="rounded-2xl bg-white p-8 shadow-md">
          <div class="flex flex-col items-center gap-8 md:flex-row">
            <div class="md:w-1/3">
              <div class="overflow-hidden rounded-xl">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  width={400}
                  height={300}
                  alt="Create an event"
                  class="h-auto w-full"
                />
              </div>
            </div>
            <div class="md:w-2/3">
              <h2 class="mb-3 text-2xl font-bold text-[#5B3E29]">
                Ready to Host Your Next Session?
              </h2>
              <p class="mb-6 text-[#6D5D4E]">
                Create a cozy gathering at your favorite spot and invite others
                to join. It's a great way to meet like-minded people and make
                the most of your favorite spaces.
              </p>
              <div class="flex flex-wrap gap-4">
                <button class="rounded bg-[#D98E73] px-4 py-2 text-white hover:bg-[#C27B62]">
                  Create an Event
                </button>
                <button class="rounded border border-[#D98E73] px-4 py-2 text-[#D98E73] hover:bg-[#FFF1E6]">
                  Browse Spaces
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Main Profile Page
export default component$(() => {
  // Data now conforms to the defined types
  const userProfile: UserProfileType = {
    name: "Stuff",
    username: "@stuff",
    bio: "am me",
    avatar: "/placeholder.svg?height=200&width=200",
    skills: ["HTML", "CSS", "JavaScript", "Sunlight"],
    joinedDate: "November 2023",
  };

  const upcomingEvents: EventType[] = [
    {
      id: 1,
      title: "Chill with kampouse",
      location: "place tranquile montreal",
      date: "December 19, 2024",
      time: "7 PM",
      attendees: 2,
      status: "Host",
      description: "Nfmfjdd",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      title: "Chill with devj",
      location: "place des Art",
      date: "December 19, 2024",
      time: "3 PM",
      attendees: 1,
      status: "Pending",
      description: "tdrtdrtzdr",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      title: "Chill with Aseel",
      location: "place tranquile montreal",
      date: "December 18, 2024",
      time: "5 AM",
      attendees: 1,
      status: "Pending",
      description: "just chilling",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 4,
      title: "Chill with devjemart",
      location: "place tranquile montreal",
      date: "December 14, 2024",
      time: "5 PM",
      attendees: 1,
      status: "Pending",
      description: "tdrdrdrdrdrtrdrdrdrtdr",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 5,
      title: "Chill with kampouse",
      location: "what up here",
      date: "December 10, 2024",
      time: "3 PM",
      attendees: 1,
      status: "Host",
      description: "will try here",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 6,
      title: "Chill with study",
      location: "place tranquile montreal",
      date: "December 10, 2024",
      time: "6 PM",
      attendees: 2,
      status: "Confirmed",
      description: "will see i think i will work on this app",
      image: "/placeholder.svg?height=300&width=400",
    },
  ];

  const savedPlaces: PlaceType[] = [
    {
      id: 1,
      name: "Place Tranquile Montreal",
      location: "1442 Rue Clark, Montréal, QC",
      description:
        "A peaceful haven with comfortable seating and the best coffee in town.",
      tags: ["Wi-Fi", "Quiet", "Coffee"],
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400",
      visitCount: 5,
    },
    {
      id: 2,
      name: "What Up Here",
      location: "417 Rue Saint-Vallier E, Québec, QC",
      description:
        "A creative hub with collaborative spaces and a vibrant community.",
      tags: ["Creative", "Groups", "Wi-Fi"],
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400",
      visitCount: 3,
    },
    {
      id: 3,
      name: "Place des Art",
      location: "175 Rue Sainte-Catherine, Montréal, QC",
      description:
        "A charming bookstore with quiet reading nooks and artisanal coffee.",
      tags: ["Books", "Coffee", "Quiet"],
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
      visitCount: 2,
    },
    {
      id: 4,
      name: "Heklo",
      location: "123 Rue Example, Montréal, QC",
      description: "Cozy spot with great ambiance for focused work.",
      tags: ["Quiet", "Wi-Fi", "Power"],
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=400",
      visitCount: 4,
    },
  ];

  const hostedEvents: EventType[] = upcomingEvents.filter(
    (event) => event.status === "Host",
  );

  const stats: StatsType = {
    upcomingEvents: upcomingEvents.length,
    hostedEvents: hostedEvents.length,
    savedPlaces: savedPlaces.length,
    connections: 12, // Assuming this is a static number for now
  };

  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      <ProfileHeader userProfile={userProfile} />
      <ProfileStats stats={stats} />
      <TabsSection
        upcomingEvents={upcomingEvents}
        hostedEvents={hostedEvents}
        savedPlaces={savedPlaces}
      />
      <CreateEventCTA />
    </div>
  );
});
