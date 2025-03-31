import { component$, useSignal } from "@builder.io/qwik";

export const SearchFilterBar = component$(() => {
  const searchTermSignal = useSignal(""); // Default search is empty
  const dateRangeSignal = useSignal("all"); // Default to show all dates

  // Note: Logic to calculate start/end dates based on dateRangeSignal
  // would typically be handled when filtering the data, not directly here.

  return (
    <div class="flex items-center gap-4">
      {" "}
      {/* Changed to flex layout */}
      {/* Search Input */}
      <div class="relative flex-grow">
        {" "}
        {/* Added flex-grow to take available space */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D98E73]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="search"
          type="text"
          bind:value={searchTermSignal}
          placeholder="Search places, events, or descriptions..."
          class="h-9 w-full rounded-md border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-[#5B3E29] placeholder-[#A99D8F] focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20" // Added height to match button
        />
      </div>
      {/* Date Range Select */}
      <div>
        <select
          id="date-range"
          bind:value={dateRangeSignal}
          class="h-9 w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-[#5B3E29] focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20" // Added height to match button
        >
          <option value="all">All Dates</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
        </select>
      </div>
      {/* Apply Filters Button */}
      <div>
        {" "}
        {/* Removed mt-3 and justify-end */}
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
});
