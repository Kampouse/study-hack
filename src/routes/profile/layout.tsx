import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import type { RequestEventLoader } from "@builder.io/qwik-city";
import {
  GetUser,
  QueryActiveRequest,
  QueryActiveEvent,
  QueryUserPlaces,
  QueryMyCompletedRequests,
  QueryUserStats,
} from "~/api/Query";
export const useQueries = routeLoader$(
  async (event: RequestEventLoader<QwikCityPlatform>) => {
    const user = await GetUser({ event: event });
    const [
      activeRequest,
      activeEvent,
      userPlaces,
      completedRequest,
      userStats,
    ] = await Promise.all([
      QueryActiveRequest({ event: event, user: user }),
      QueryActiveEvent({ event: event, user: user }),
      QueryUserPlaces({ event: event, user: user }),
      QueryMyCompletedRequests({ event: event, user: user }),
      QueryUserStats({ event: event, user: user }),
    ]);
    return {
      userData: user,
      activeRequest: activeRequest,
      activeEvent: activeEvent,
      completedRequest: completedRequest,
      userStats: userStats,
      userPlaces: userPlaces,
    };
  },
);
export default component$(() => {
  return (
    <div class="">
      <Slot />
    </div>
  );
});
