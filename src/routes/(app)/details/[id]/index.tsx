import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getEvent, getConfirmedUsers } from "~/api/EndPoint";

export const useEventDetails = routeLoader$(async (event) => {
  const id = event.params.id;
  console.log(id);
  const eventData = await getEvent(event, id);
  const confirmData = await getConfirmedUsers(event, parseInt(id));
  return {
    event: eventData,
    confirmed: confirmData,
  };
});

export default component$(() => {
  const data = useEventDetails();
  return (
    <div class="container mx-auto min-h-screen bg-gradient-to-b from-blue-50/30 to-white px-4 py-10">
      <div class="mx-auto max-w-3xl rounded-3xl border border-blue-50 bg-white p-8 shadow-lg shadow-blue-100/50">
        <header class="mb-10 space-y-6">
          <div class="flex flex-col items-start justify-between gap-4 border-b border-blue-50 pb-6">
            <h1 class="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
              {data.value.event.data?.event.name}
            </h1>
            <span class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {(() => {
                const date = new Date(data.value.event.data?.event.date || "");
                const dateOptions: Intl.DateTimeFormatOptions = {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                };
                return date.toLocaleDateString("en-US", dateOptions);
              })()}
            </span>
          </div>

          <div class="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-md">
            <img
              src={
                data.value.event.data?.event.image ||
                "https://via.placeholder.com/1200x400"
              }
              alt="Event cover"
              class="absolute inset-0 h-full w-full object-cover"
              width={1200}
              height={400}
            />
          </div>
        </header>

        <div class="space-y-10">
          <section class="space-y-4">
            <h2 class="flex items-center gap-3 text-2xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-500"
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
              Event Details
            </h2>
            <div class="rounded-2xl bg-blue-50/50 p-7 shadow-sm">
              <p class="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
                {data.value.event.data?.event.description}
              </p>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="flex items-center gap-3 text-2xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-500"
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
            <div class="rounded-2xl bg-blue-50/50 p-7 shadow-sm">
              {data.value.event.data?.location && (
                <div class="mt-1 space-y-2">
                  <div class="h-48 overflow-hidden rounded-xl">
                    <img
                      src={
                        data.value.event.data.location.ImageURL ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={data.value.event.data.location.Name}
                      class="h-96 w-full object-cover"
                      width={400}
                      height={300}
                    />
                  </div>
                  <p class="text-lg font-medium text-gray-800">
                    {data.value.event.data?.event.location}
                  </p>
                  <p class="text-base text-gray-600">
                    {data.value.event.data.location.Description}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="flex items-center gap-3 text-2xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Attendees
            </h2>
            <div class="grid gap-4">
              {data.value.confirmed.data &&
              data.value.confirmed.data.length > 0 ? (
                data.value.confirmed.data.map((attendee) => (
                  <div
                    key={attendee.requestId}
                    class="flex items-start gap-4 rounded-2xl bg-blue-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-blue-50"
                  >
                    <img
                      src={
                        attendee.user?.image ?? "https://via.placeholder.com/40"
                      }
                      alt={attendee.user?.name ?? "Anonymous"}
                      class="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                      width={48}
                      height={48}
                    />
                    <div class="flex-1 space-y-2">
                      <p class="font-medium text-gray-800">
                        {attendee.user?.name}
                      </p>
                      <p class="text-sm text-gray-600">{attendee.whyJoin}</p>
                      <p class="text-xs text-gray-500">{attendee.background}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div class="flex flex-col items-center justify-center rounded-2xl bg-blue-50/50 p-10 text-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mb-4 h-16 w-16 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 class="mb-1 text-xl font-semibold text-gray-800">
                    No attendees yet
                  </h3>
                  <p class="mb-6 text-gray-600">
                    Be the first to join this event!
                  </p>
                  <Link
                    href={`/join/${data.value.event.data?.event.eventID}`}
                    class="inline-flex items-center rounded-full bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Join Event
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});
