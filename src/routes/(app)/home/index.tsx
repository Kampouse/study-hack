import { component$, } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import { getEvents } from "~/api/EndPoint";
import { QueryPlaces } from "~/api/Query";
import { drizzler } from "~/api/drizzled";

// Import components from the same directory
export type Events = Awaited<ReturnType<typeof useEvents>>;

export const head = {
  title: " S&H | Home",
};

export const useEvents = routeLoader$(async (event) => {
  const data = await getEvents({
    event: event,
    options: {
      limit: 1000, // Consider pagination or smaller limits for performance
    },
  });
  return data;
});

export const usePlaces = routeLoader$(async (event) => {
  const client = await drizzler(event);
  const data = await QueryPlaces({
    event: event,
    client: client,
    params: {
      limit: 75, // Consider pagination
    },
  });
  return { data: data.data, success: data.success };
});


export default component$(() => {

  return (
    <div class="min-h-screen bg-[#FFF8F0]"></div>
  );
});
