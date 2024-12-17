import { component$ } from "@qwik.dev/core";
import { routeLoader$ } from "@qwik.dev/router";
import { getPlace } from "~/api/EndPoint";
export const useloadPlace = routeLoader$(async (context) => {
  const placeName = context.params.name;
  const data = await getPlace({ event: context, id: parseInt(placeName) });
  console.log(data);

  return { ...data };
});
export default component$(() => {
  const place = useloadPlace();
  return (
    <div class="mx-auto mt-2 flex max-w-3xl flex-col gap-4 rounded-lg bg-white p-4 pt-10 shadow-lg">
      <h1 class="px-2 text-left text-2xl font-bold text-gray-900 md:text-3xl">
        {place.value.data?.Name}
      </h1>
      <img
        width="1920"
        height="1500"
        src={place.value.data?.ImageURL as string}
        alt={place.value.data?.Description}
        class="h-64 w-full rounded-lg object-cover shadow-md md:h-96"
      />
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 class="mb-2 text-lg font-bold text-gray-900 md:text-xl">
          Place Review
        </h2>
        <p class="mb-4 text-sm text-gray-800 md:text-base">
          {place.value.data?.Description}
        </p>
        <div class="flex items-center">
          <span class="text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>
                {i < Math.floor(place.value.data?.Rating || 0) ? "★" : "☆"}
              </span>
            ))}
          </span>
          <span class="ml-2 text-sm text-gray-800">
            {Math.floor(place.value.data?.Rating || 0)} out of 5
          </span>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900 md:text-xl">
            Previous Event
          </h2>
          <a
            href={`/events/create/at/${place.value.data?.PlaceID}`}
            class="
            flex items-center justify-center gap-0.5 overflow-hidden rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-base"
          >
            Create Event
          </a>
        </div>
        <>
          <h3 class="mb-1 text-base font-semibold text-gray-800 md:text-lg">
            Summer Meetup 2023
          </h3>
          <p class="mb-2 text-sm text-gray-800 md:text-base">
            A fantastic gathering of local community members for food, music and
            networking. Featured live performances and local food vendors.
          </p>
          <div class="text-sm text-gray-700">
            <p>Date: August 15, 2023</p>
            <p>Attendance: 250 people</p>
          </div>
        </>
      </div>
    </div>
  );
});
