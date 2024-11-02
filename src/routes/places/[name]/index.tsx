import { component$ } from "@builder.io/qwik";
export default component$(() => {
  return (
    <div class="mx-auto mt-2 flex max-w-3xl flex-col gap-4 rounded-lg bg-slate-50 p-4">
      <img
        width="1920"
        height="1500"
        src="https://www.countryandtownhouse.com/wp-content/uploads/2022/04/ruben-ramirez-xhKG01FN2uk-unsplash.jpg"
        alt="Location"
        class="h-64 w-full rounded-lg object-cover md:h-96"
      />
      <h1 class="px-2 text-left text-2xl font-bold text-gray-800 md:text-3xl">
        Scenic Mountain Retreat
      </h1>
      <div class="rounded-lg border p-4 ">
        <h2 class="mb-2 text-lg font-bold md:text-xl">Place Review</h2>
        <p class="mb-4 text-sm text-gray-700 md:text-base">
          This location offers a beautiful setting for various events. With its
          spacious grounds and scenic views, it's an ideal spot for outdoor
          gatherings.
        </p>
        <div class="flex items-center">
          <span class="text-yellow-400">★★★★☆</span>
          <span class="ml-2 text-sm text-gray-600">4.0 out of 5</span>
        </div>
      </div>

      <div class="rounded-lg  border p-4 ">
        <h2 class="mb-2 text-lg font-bold md:text-xl">Previous Event</h2>
        <h3 class="mb-1 text-base font-semibold md:text-lg">
          Summer Festival 2023
        </h3>
        <p class="mb-2 text-sm text-gray-700 md:text-base">
          Last year's summer festival was a huge success, attracting over 1000
          attendees. The event featured live music, food stalls, and various
          activities for all ages.
        </p>
        <div class="text-sm text-gray-600">
          <p>Date: August 15, 2023</p>
          <p>Attendance: 1000+</p>
        </div>
      </div>
    </div>
  );
});
