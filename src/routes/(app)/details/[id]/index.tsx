import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getEvent, getConfirmedUsers } from "~/api/EndPoint";

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
  console.log(data.value.event.data?.event.starttime);

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
    <div class="min-h-screen bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] px-4 py-12">
      <div class="container mx-auto">
        <div class="mb-6 flex items-center">
          <Link
            href="/home"
            class="flex items-center gap-2 text-[#D98E73] transition hover:text-[#C27B62]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" />
            </svg>
            <span>Back to Events</span>
          </Link>
        </div>

        <div class="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
          <div class="relative aspect-[21/9] w-full overflow-hidden">
            <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent"></div>
            <img
              src={
                data.value.event.data?.event.image ||
                "https://via.placeholder.com/1200x400"
              }
              alt="Event cover"
              class="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
              width={1200}
              height={400}
            />
            <div class="absolute bottom-0 left-0 z-20 p-8 text-white">
              <div class="mb-2 inline-flex items-center rounded-full bg-[#D98E73]/80 px-3 py-1 text-sm backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-1.5 h-4 w-4"
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
              <h1 class="text-3xl font-bold tracking-tight drop-shadow-md sm:text-5xl">
                {data.value.event.data?.event.name}
              </h1>
            </div>
          </div>

          <div class="p-8">
            <div class="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div class="flex items-center gap-3">
                <div class="text-sm text-gray-500">
                  {data.value.confirmed.data ? (
                    <span class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-[#D98E73]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      {data.value.confirmed.data.length}{" "}
                      {data.value.confirmed.data.length === 1
                        ? "Attendee"
                        : "Attendees"}
                    </span>
                  ) : (
                    <span class="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      No attendees yet
                    </span>
                  )}
                </div>
              </div>

              <div class="flex gap-2">
                <Link
                  href={`/join/${data.value.event.data?.event.eventID}`}
                  class="inline-flex items-center gap-2 rounded-lg bg-[#D98E73] px-5 py-2.5 text-center text-sm font-medium text-white shadow-lg transition-all hover:bg-[#C27B62] hover:shadow-[#F8D7BD] focus:outline-none focus:ring-4 focus:ring-[#F8D7BD]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Join Event
                </Link>
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg border border-[#E6D7C3] bg-white px-3 py-2.5 text-center text-sm font-medium text-[#6D5D4E] shadow-sm hover:bg-[#FFF8F0] focus:outline-none focus:ring-4 focus:ring-[#F8EDE3]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="grid gap-8 md:grid-cols-3">
              <section class="space-y-8 md:col-span-2">
                <div class="space-y-4">
                  <h2 class="flex items-center gap-2 text-2xl font-semibold text-[#5B3E29]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-[#D98E73]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    About This Event
                  </h2>
                  <div class="rounded-xl bg-[#F8EDE3] p-6 shadow-sm">
                    <p class="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
                      {data.value.event.data?.event.description}
                    </p>
                  </div>
                </div>

                <div class="space-y-4">
                  <h2 class="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-[#D98E73]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Attendees
                  </h2>
                  <div class="space-y-4">
                    {data.value.confirmed.data &&
                    data.value.confirmed.data.length > 0 ? (
                      data.value.confirmed.data.map((attendee) => (
                        <div
                          key={attendee.requestId}
                          class="flex items-start gap-4 rounded-xl border border-[#E6D7C3] bg-white p-6 shadow-sm transition-all hover:shadow-md"
                        >
                          <img
                            src={
                              attendee.user?.image ??
                              "https://via.placeholder.com/40"
                            }
                            alt={attendee.user?.name ?? "Anonymous"}
                            class="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-[#F8D7BD]"
                            width={56}
                            height={56}
                          />
                          <div class="flex-1 space-y-2">
                            <p class="font-medium text-[#5B3E29]">
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
                      ))
                    ) : (
                      <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E6D7C3] bg-white p-12 text-center">
                        <div class="mb-4 rounded-full bg-[#F8D7BD] p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-10 w-10 text-[#D98E73]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <h3 class="mb-2 text-xl font-semibold text-[#5B3E29]">
                          No attendees yet
                        </h3>
                        <p class="mb-8 max-w-md text-[#6D5D4E]">
                          Be the first to join this exciting event! Connect with
                          others who share your interests.
                        </p>
                        <Link
                          href={`/join/${data.value.event.data?.event.eventID}`}
                          class="inline-flex items-center gap-2 rounded-lg bg-[#D98E73] px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#F8D7BD] focus:ring-offset-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                          Join Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div class="space-y-6">
                <section class="space-y-4">
                  <h2 class="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-[#D98E73]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Location
                  </h2>
                  <div class="overflow-hidden rounded-xl border border-[#E6D7C3] bg-white shadow-sm">
                    {data.value.event.data?.location && (
                      <div class="space-y-4">
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
                          <p class="text-sm text-gray-600">
                            {data.value.event.data.location.Description}
                          </p>
                          <a
                            href="#"
                            class="mt-4 inline-flex items-center text-sm font-medium text-[#D98E73] hover:text-[#C27B62]"
                          >
                            <span>Get directions</span>
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
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section class="rounded-xl bg-[#F8EDE3] p-6">
                  <h3 class="mb-4 font-semibold text-[#5B3E29]">
                    Event Details
                  </h3>
                  <ul class="space-y-3">
                    <li class="flex items-start gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="mt-0.5 h-5 w-5 text-[#D98E73]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="text-sm">
                        <span class="font-medium text-[#5B3E29]">
                          Date & Time:
                        </span>
                        <div class="text-[#8B5A2B]">
                          {formatEventDate(
                            data.value.event.data?.event.date || "",
                          )}
                        </div>
                      </div>
                    </li>
                    <li class="flex items-start gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="mt-0.5 h-5 w-5 text-[#D98E73]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <div class="text-sm">
                        <span class="font-medium text-[#D98E73]">
                          Attendees:
                        </span>
                        <div class="text-[#D98E73]">
                          {data.value.confirmed.data?.length || 0} registered
                        </div>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
