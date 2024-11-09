import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
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
    <div class="mx-auto mt-2 flex max-w-3xl flex-col gap-4 rounded-lg bg-slate-50 p-4">
      <img
        width="1920"
        height="1500"
        src={place.value.data?.ImageURL as string}
        alt={place.value.data?.Description}
        class="h-64 w-full rounded-lg object-cover md:h-96"
      />
      <h1 class="px-2 text-left text-2xl font-bold text-gray-800 md:text-3xl">
        {place.value.data?.Name}
      </h1>
      <div class="rounded-lg border p-4 ">
        <h2 class="mb-2 text-lg font-bold md:text-xl">Place Review</h2>
        <p class="mb-4 text-sm text-gray-700 md:text-base">
          {place.value.data?.Description}
        </p>
        <div class="flex items-center">
          <span class="text-yellow-400">★★★★☆</span>
          <span class="ml-2 text-sm text-gray-600">
            {place.value.data?.Rating} out of 5
          </span>
        </div>
      </div>

      <div class="rounded-lg  border p-4 ">
        <h2 class="mb-2 text-lg font-bold md:text-xl">Previous Event</h2>
        <>
          <h3 class="mb-1 text-base font-semibold md:text-lg">
            Summer Meetup 2023
          </h3>
          <p class="mb-2 text-sm text-gray-700 md:text-base">
            A fantastic gathering of local community members for food, music and
            networking. Featured live performances and local food vendors.
          </p>
          <div class="text-sm text-gray-600">
            <p>Date: August 15, 2023</p>
            <p>Attendance: 250 people</p>
          </div>
        </>
      </div>
    </div>
  );
});
