import {
  type QueryEventOptions,
  QueryEvents,
  QueryEvent,
} from "~/helpers/query";

import type { Requested } from "~/helpers/drizzled";

export const getEvents = async (
  event: Requested,
  options: QueryEventOptions,
) => {
  try {
    const data = await QueryEvents(event, options);
    console.log(data);
    if (data === null || data === undefined) {
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


    const data = await QueryEvent(event, parseInt(id));
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
  const response = await getEvents(event, options);

  if (response.success && response.data !== null) {
    return response;
  }
  return null;
};
type baseEvent = ReturnType<Awaited<typeof getFirstEvent>>;
export type Events = baseEvent extends Promise<infer T> ? T : never;
