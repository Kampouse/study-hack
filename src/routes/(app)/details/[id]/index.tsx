import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getEvent, getConfirmedUsers } from "~/api/EndPoint";
import {
  StarIcon,
  MapPinIcon,
  MessageSquareIcon,
  Share2Icon,
  UsersIcon,
} from "lucide-qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export const useEventDetails = routeLoader$(async (event) => {
  const id = event.params.id;
  const eventData = await getEvent(event, id);
  const confirmData = await getConfirmedUsers(event, parseInt(id));
  return {
    event: eventData,
    confirmed: confirmData,
  };
});

export default component$(() => {
  const data = useEventDetails();

  const formatEventDate = (dateString: string, starttime?: string) => {
    if (!dateString) return "TBD";

    try {
      const date = new Date(dateString);

      // Add time information if starttime is provided
      if (starttime) {
        const [hours, minutes] = starttime
          .split(":")
          .map((part) => parseInt(part, 10));
        if (!isNaN(hours) && !isNaN(minutes)) {
          date.setHours(hours, minutes);
        }
      }

      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      };

      return date.toLocaleDateString("en-US", dateOptions);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if parsing fails
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-[#F8EDE3] to-[#FFF8F0] md:pt-20">
      <div class="mx-auto flex max-w-7xl flex-col px-4 py-4 pt-32 lg:flex-row lg:gap-6 lg:p-6">
        {/* Main Content */}
        <div class="flex-1 space-y-6">
          {/* Hero Section */}
          <div class="overflow-hidden rounded-xl border-[#E6D7C3]/40 bg-white/90 shadow-xl backdrop-blur-sm">
            <div class="relative">
              <img
                src={
                  data.value.event.data?.event.image ||
                  "https://via.placeholder.com/1200x400"
                }
                alt="Event cover"
                class="h-[250px] w-full object-cover sm:h-[350px] md:h-[450px]"
                width={900}
                height={450}
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Overlay Content */}
              <div class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div class="flex items-end justify-between">
                  <div class="rounded-xl bg-black/20 px-3 py-2 text-white backdrop-blur-sm sm:px-6 sm:py-4">
                    <div class="mb-2 inline-flex items-center rounded-full bg-[#D98E73]/90 px-3 py-1 text-sm font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatEventDate(
                        data.value.event.data?.event.date || "",
                        data.value.event.data?.event.starttime || "",
                      )}
                    </div>
                    <h2 class="mb-1 text-xl font-bold sm:mb-2 sm:text-2xl">
                      {data.value.event.data?.event.name}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Event Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#D98E73]">
                <UsersIcon class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="mb-1 text-lg font-semibold text-[#5B3E29]">
                  {data.value.confirmed.data &&
                  data.value.confirmed.data.length > 0
                    ? `${data.value.confirmed.data.length} lovely people attending`
                    : "Be the first to join this event!"}
                </h3>
                <p class="text-sm text-[#6D5D4E]/70">
                  Connect with like-minded people at this event
                </p>
              </div>
              <Link
                href={`/join/${data.value.event.data?.event.eventID}`}
                class="mt-2 w-full rounded-lg bg-[#D98E73] px-6 py-2 text-center text-white hover:bg-[#C27B62] sm:mt-0 sm:w-auto"
              >
                Join This Event
              </Link>
            </div>
          </div>

          {/* Event Details Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            {/* Description Section with improved spacing */}
            <div class="mb-6">
              <h3 class="mb-3 text-lg font-semibold text-[#5B3E29] md:text-xl">
                About this event
              </h3>
              <p class="leading-relaxed text-[#6D5D4E]/80 md:text-base">
                {data.value.event.data?.event.description}
              </p>
            </div>
            <div class="border-t border-[#E6D7C3]/50 pt-6">
              {/* Combined Quick Info and Details in one box */}
              <div class="rounded-lg bg-[#F8EDE3]/30 p-4">
                <div class="mb-4 flex items-center justify-between">
                  <h3 class="flex items-center gap-2 text-lg font-semibold text-[#5B3E29]">
                    <StarIcon class="h-5 w-5 text-[#D98E73]" />
                    Event Details
                  </h3>
                </div>

                <div class="space-y-3">
                  {/* Date & Time */}
                  <div class="flex items-center justify-between rounded-md bg-white/50 p-2.5">
                    <span class="text-sm text-[#6D5D4E]/80 md:text-base">
                      Date & Time
                    </span>
                    <span class="font-medium text-[#5B3E29]">
                      {formatEventDate(
                        data.value.event.data?.event.date || "",
                        data.value.event.data?.event.starttime || "",
                      )}
                    </span>
                  </div>

                  {/* Attendees */}
                  <div class="flex items-center justify-between rounded-md bg-white/50 p-2.5">
                    <span class="text-sm text-[#6D5D4E]/80 md:text-base">
                      Attendees
                    </span>
                    <span class="font-medium text-[#5B3E29]">
                      {data.value.confirmed.data?.length
                        ? `${data.value.confirmed.data.length} registered`
                        : "Be the first to join!"}
                    </span>
                  </div>

                  {/* Location */}
                  {data.value.event.data?.location && (
                    <div class="rounded-md bg-white/50 p-2.5">
                      <div class="mb-1 flex items-center justify-between">
                        <span class="text-sm text-[#6D5D4E]/80 md:text-base">
                          Location
                        </span>
                      </div>
                      <div class="text-[#6D5D4E]">
                        <p class="text-sm font-medium md:text-base">
                          {data.value.event.data.location.Name}
                        </p>
                        <p class="text-xs text-[#6D5D4E]/80 md:text-sm">
                          {data.value.event.data.location.Address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div class="mt-2 flex justify-between gap-3">
                    {data.value.event.data?.location && (
                      <Link
                        href={`/places/${data.value.event.data.location.Name}`}
                        class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D98E73] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#C27B62]"
                      >
                        <MapPinIcon class="h-4 w-4" />
                        View Location
                      </Link>
                    )}
                    <button
                      type="button"
                      class="inline-flex items-center rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-center text-sm font-medium text-[#6D5D4E] shadow-sm hover:bg-[#FFF8F0]"
                      aria-label="Share event"
                    >
                      <Share2Icon class="mr-1 h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendees Section */}
          <div class="rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-lg backdrop-blur-sm sm:p-6">
            <div class="mb-4">
              <div class="flex items-center justify-between">
                <h2 class="flex items-center gap-2 text-lg font-semibold text-[#5B3E29] sm:text-xl">
                  <MessageSquareIcon class="h-5 w-5" />
                  Attendees
                </h2>
                <span class="inline-block rounded-full bg-[#F8D7BD] px-2 py-0.5 text-sm text-[#8B5A2B]">
                  {data.value.confirmed.data?.length || 0} registered
                </span>
              </div>
            </div>
            <div class="space-y-6">
              {data.value.confirmed.data &&
              data.value.confirmed.data.length > 0 ? (
                <div class="grid gap-4 sm:grid-cols-2">
                  {data.value.confirmed.data.map((attendee) => (
                    <div
                      key={attendee.requestId}
                      class="flex items-start gap-4 rounded-xl border border-[#E6D7C3] bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <img
                        src={
                          attendee.user?.image ??
                          "https://via.placeholder.com/40"
                        }
                        alt={attendee.user?.name ?? "Anonymous"}
                        class="h-16 w-16 rounded-full object-cover shadow-md ring-2 ring-[#F8D7BD]"
                        width={64}
                        height={64}
                      />
                      <div class="flex-1 space-y-2">
                        <p class="text-lg font-medium text-[#5B3E29]">
                          {attendee.user?.name}
                        </p>
                        {attendee.whyJoin && (
                          <div>
                            <p class="mb-1 text-xs font-semibold uppercase text-[#D98E73]">
                              Why I'm attending
                            </p>
                            <p class="text-sm italic text-gray-600">
                              "{attendee.whyJoin}"
                            </p>
                          </div>
                        )}
                        {attendee.background && (
                          <div>
                            <p class="mb-1 mt-2 text-xs font-semibold uppercase text-[#D98E73]">
                              Background
                            </p>
                            <p class="text-sm text-[#6D5D4E]">
                              {attendee.background}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E6D7C3] bg-white p-12 text-center">
                  <div class="mb-4 rounded-full bg-[#F8D7BD] p-4">
                    <UsersIcon class="h-12 w-12 text-[#D98E73]" />
                  </div>
                  <h3 class="mb-3 text-2xl font-semibold text-[#5B3E29]">
                    No attendees yet
                  </h3>
                  <p class="mb-8 max-w-md text-lg text-[#6D5D4E]">
                    Be the first to join this exciting event! Connect with
                    others who share your interests.
                  </p>
                  <Link
                    href={`/join/${data.value.event.data?.event.eventID}`}
                    class="inline-flex items-center gap-2 rounded-lg bg-[#D98E73] px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#F8D7BD] focus:ring-offset-2"
                  >
                    <UsersIcon class="h-5 w-5" />
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Location Section (only visible on mobile) */}
          <div class="block rounded-xl border-[#E6D7C3]/40 bg-white/90 p-4 shadow-lg backdrop-blur-sm lg:hidden">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-[#5B3E29] sm:text-xl">
                Location
              </h3>
            </div>
            {data.value.event.data?.location ? (
              <div class="overflow-hidden rounded-xl border border-[#E6D7C3]">
                <div class="h-48 overflow-hidden">
                  <img
                    src={
                      data.value.event.data.location.ImageURL ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={data.value.event.data.location.Name}
                    class="h-full w-full object-cover transition duration-700 hover:scale-105"
                    width={400}
                    height={300}
                  />
                </div>
                <div class="p-4">
                  <h3 class="mb-2 font-semibold text-[#5B3E29]">
                    {data.value.event.data.location.Name}
                  </h3>
                  <p class="line-clamp-2 text-sm text-gray-600">
                    {data.value.event.data.location.Description}
                  </p>
                  <Link
                    href={`/places/${data.value.event.data.location.Name}`}
                    class="mt-4 inline-flex items-center text-sm font-medium text-[#D98E73] hover:text-[#C27B62]"
                  >
                    <span>View Location Details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="ml-1 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <p class="text-[#6D5D4E]">No location information available</p>
            )}
          </div>
        </div>

        {/* Right Sidebar - Location Details (only visible on desktop) */}
        <div class="hidden w-96 space-y-6 lg:block">
          <div class="sticky top-24 rounded-xl border-[#E6D7C3]/40 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <div class="mb-4">
              <h3 class="text-xl font-semibold text-[#5B3E29]">Location</h3>
            </div>
            {data.value.event.data?.location ? (
              <div class="space-y-4">
                <div class="overflow-hidden rounded-xl border border-[#E6D7C3]">
                  <div class="h-48 overflow-hidden">
                    <img
                      src={
                        data.value.event.data.location.ImageURL ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={data.value.event.data.location.Name}
                      class="h-full w-full object-cover transition duration-700 hover:scale-105"
                      width={400}
                      height={300}
                    />
                  </div>
                  <div class="p-4">
                    <h3 class="mb-2 font-semibold text-[#5B3E29]">
                      {data.value.event.data.location.Name}
                    </h3>
                    <p class="text-sm text-[#6D5D4E]/80">
                      {data.value.event.data.location.Description}
                    </p>
                    <div class="mt-4 flex items-center gap-1 text-sm text-[#6D5D4E]/70">
                      <MapPinIcon class="h-4 w-4" />
                      <span>{data.value.event.data.location.Address}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-4">
                  <Link
                    href={`/places/${data.value.event.data.location.Name}`}
                    class="block w-full rounded-xl bg-gradient-to-r from-[#D98E73] to-[#C27B62] py-3 text-center font-medium text-white shadow-lg hover:from-[#C27B62] hover:to-[#A6654E]"
                  >
                    View Location Details
                  </Link>
                </div>
              </div>
            ) : (
              <div class="rounded-lg bg-[#F8EDE3]/30 p-4 text-center">
                <p class="text-[#6D5D4E]">No location information available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const event = resolveValue(useEventDetails);
  return {
    title: `Study & Hack | ${event.event.data?.event.name || "Event Details"}`,
    meta: [
      {
        name: "description",
        content: event.event.data?.event.description || "",
      },
      {
        property: "og:title",
        content: `Study & Hack | ${event.event.data?.event.name || "Event Details"}`,
      },
      {
        property: "og:description",
        content: event.event.data?.event.description || "",
      },
      {
        property: "og:image",
        content: event.event.data?.event.image || "",
      },
    ],
  };
};
