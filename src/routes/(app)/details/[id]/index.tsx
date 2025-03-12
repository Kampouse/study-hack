import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
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
    <div class="container mx-auto px-4 py-8">
      <div class="rounded-xl bg-white p-6 shadow-lg">
        <div class="mb-8 flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">
            {data.value.event.data?.event.name}
          </h1>
          <span class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
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
            })()}{" "}
          </span>
        </div>

        <div class="mb-8">
          <img
            src={
              data.value.event.data?.event.image ||
              "https://via.placeholder.com/1200x400"
            }
            alt="Event cover"
            class="h-64 w-full rounded-xl object-cover"
            width={1200}
            height={400}
          />
        </div>

        <div class="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 class="mb-4 text-xl font-semibold text-gray-900">
              Event Details
            </h2>
            <p class="text-gray-600">
              {data.value.event.data?.event.description}
            </p>
          </div>
          <div>
            <h2 class="mb-4 text-xl font-semibold text-gray-900">Location</h2>
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="font-medium text-gray-900">
                {data.value.event.data?.event.location}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 class="mb-4 text-xl font-semibold text-gray-900">Attendees</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.value.confirmed.data?.map(
              (attendee) =>
                attendee && (
                  <div
                    key={attendee.requestId}
                    class="flex items-center gap-4 rounded-lg bg-gray-50 p-4"
                  >
                    <img
                      src={
                        attendee.user?.image ?? "https://via.placeholder.com/40"
                      }
                      alt={attendee.user?.name ?? "Anonymous"}
                      class="h-10 w-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p class="font-medium text-gray-900">
                        {attendee.user?.name}
                      </p>
                      <p class="text-sm text-gray-600">{attendee.whyJoin}</p>
                      <p class="mt-1 text-xs text-gray-500">
                        {attendee.background}
                      </p>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
