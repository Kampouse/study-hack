import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import type { RequestEventLoader } from "@builder.io/qwik-city";
import {
  GetUser,
  QueryActiveRequest,
  QueryActiveEvent,
  QueryMyCompletedRequests,
} from "~/api/Query";
export const useQueries = routeLoader$(
  async (event: RequestEventLoader<QwikCityPlatform>) => {
    console.log("ran->");
    const user = await GetUser({ event: event });
    const [activeRequest, activeEvent, completedRequest] = await Promise.all([
      QueryActiveRequest({ event: event, user: user }),
      QueryActiveEvent({ event: event, user: user }),
      QueryMyCompletedRequests({ event: event, user: user }),
    ]);
    return {
      userData: user,
      activeRequest: activeRequest,
      activeEvent: activeEvent,
      completedRequest: completedRequest,
    };
  },
);
export type UserQueries = ReturnType<typeof useQueries>;
export const queryContext = createContextId<UserQueries>("profile-data");

export default component$(() => {
  const userData = useQueries();
  useContextProvider(queryContext, userData);
  return (
    <div class="">
      <Slot />
    </div>
  );
});
