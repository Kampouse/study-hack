import { type QueryEventOptions, QueryEvents } from "~/helpers/query";

import type { Requested } from "~/helpers/drizzled";

export const getEvents = async (
  event: Requested,
  options: QueryEventOptions,
) => {
  try {
    const data = await QueryEvents(event, options);
    if (data === null || data === undefined) {
      return { success: false, data: null, error: "Failed to get events" };
    }
    return { success: true, data: data };
  } catch (e) {
    console.log(e);
    return { success: false, data: null, error: "Failed to get events" };
  }
};
