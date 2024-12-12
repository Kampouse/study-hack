import { QueryPlace } from "./Query";
import {
  type QueryEventOptions,
  QueryEvents,
  QueryEvent,
  QueryAllReferenceEvents,
  QueryPlaces,
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
    return {
      success: true,
      data: data?.map((item) => {
        return {
          ...item,
          date: (() => {
            const date = new Date(item.date);
            const hrs = item.starttime ? item.starttime.split(":")[0] : "00";
            const minutes = item.starttime
              ? item.starttime.split(":")[1]
              : "00";
            const ampm = parseInt(hrs) >= 12 ? "PM" : "AM";
            const formattedHours = parseInt(hrs) % 12 || 12;
            return `${date.toLocaleDateString()} at ${formattedHours}:${minutes} ${ampm}`;
          })(),
          starttime: item.starttime.slice(0, 5), // Only take HH:MM
          host: item.userID == user?.ID,
        };
      }),
    };
  } catch (e) {
    console.log(e);
    return { success: false, data: null, error: "Failed to get events" };
  }
};

export const getEvent = async (event: Requested, id: string) => {
  try {
    const data = await QueryEvent({ event, id: parseInt(id), options: {} });

    return { success: true, data: data };
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
    options: {
      limit: 8,
    },
  });

  return data;
};
export const getPlace = async ({
  event,
  id,
}: {
  event: Requested;
  id: number;
}) => {
  try {
    const data = await QueryPlace({
      event,
      placeId: id,
    });
    console.log(data);

    if (!data.success || !data.data) {
      return { success: false, data: null, error: "Failed to get place" };
    }
    return { success: true, data: data.data };
  } catch (e) {
    console.log(e);
    return { success: false, data: null, error: "Failed to get place" };
  }
};

export const getPlaces = async (event: Requested) => {
  try {
    const data = await QueryPlaces({ event: event as Requested });
    if (!data.success || !data.data) {
      return { success: false, data: null, error: "Failed to get places" };
    }
    return { success: true, data: data.data };
  } catch (e) {
    console.log(e);
    return { success: false, data: null, error: "Failed to get places" };
  }
};
