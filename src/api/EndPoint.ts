import {
  type QueryEventOptions,
  QueryEvents,
  QueryEvent,
  QueryAllReferenceEvents,
  GetUser,
} from "~/api/Query";

import type { Requested } from "~/api/drizzled";

export const getEvents = async ({
  event,
  options,
}: {
  event: Requested;
  options: QueryEventOptions;
}) => {
  try {
    const user = await GetUser({ event });

    console.log("you cant be null ", user);
    const data = await QueryEvents({
      event,
      options: { ...options, byUser: user?.ID },
    });
    if (data === null) {
      return { success: false, data: null, error: "Failed to get events" };
    }
    return { success: true, data: data };
  } catch (e) {
    console.log(e);
    return { success: false, data: null, error: "Failed to get events" };
  }
};

export const getEvent = async (event: Requested, id: string) => {
  try {
    const data = await QueryEvent({ event, id: parseInt(id), options: {} });
    if (data === null || data === undefined) {
      return { success: false, data: null, error: "Failed to get event" };
    }
    return { success: true, data: data[0] };
  } catch (e) {
    console.log(e);
    return { success: false, data: null, error: "Failed to get event" };
  }
};

export const getFirstEvent = async (
  event: Requested,
  options: QueryEventOptions,
) => {
  const response = await getEvents({ event, options });

  if (response.success && response.data !== null) {
    return response;
  }
  return null;
};
type baseEvent = ReturnType<Awaited<typeof getFirstEvent>>;
export type Events = baseEvent extends Promise<infer T> ? T : never;

export const getAllReferenceEvents = async (event: Requested) => {
  const user = await GetUser({ event });

  const data = await QueryAllReferenceEvents({
    event: event,
    UserID: user?.ID as number,
  });
  return data;
};
