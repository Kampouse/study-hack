import {
  UpdateUser,
  CreateEvent,
  createJoinRequest,
  GetUser,
} from "~/api/Query";
import type { Requested } from "~/api/drizzled";
import type { JSONObject } from "@builder.io/qwik-city";
import * as v from "valibot";

export const eventSchema = v.object({
  Name: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  Description: v.pipe(v.string(), v.minLength(3), v.maxLength(75)),
  ImageURL: v.optional(v.pipe(v.string(), v.url())),
  Date: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  Location: v.pipe(v.string(), v.minLength(3), v.maxLength(75)),
  Coordinates: v.optional(v.tuple([v.number(), v.number()]), [0, 0]),
  StartTime: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  EndTime: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
});
export const placeSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  address: v.pipe(v.string(), v.minLength(1), v.maxLength(200)),
  image: v.optional(v.pipe(v.string(), v.url())),
  description: v.pipe(v.string(), v.minLength(10), v.maxLength(500)),
  tags: v.optional(v.array(v.string())),
  rating: v.string(),
  wifiSpeed: v.optional(v.number()),
  hasQuietEnvironment: v.optional(v.boolean()),
});

export type PlaceForm = v.InferOutput<typeof placeSchema>;

export const joinRequestSchema = v.object({
  ExperienceLevel: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  Background: v.pipe(v.string(), v.minLength(10), v.maxLength(500)),
  WhyJoin: v.pipe(v.string(), v.minLength(10), v.maxLength(500)),
});

export type JoinRequestForm = v.InferOutput<typeof joinRequestSchema>;

export type CreateEventForm = v.InferOutput<typeof eventSchema>;

export const userSchema = v.object({
  Name: v.pipe(v.string(), v.minLength(3), v.maxLength(100)),
  Description: v.pipe(v.string(), v.minLength(3), v.maxLength(75)),
  ImageURL: v.optional(v.pipe(v.string(), v.url())),
  Intrests: v.array(v.pipe(v.string(), v.minLength(3), v.maxLength(20))),
});
export type UpdateUserForm = v.InferOutput<typeof userSchema>;

export const updateProfileForm = async (data: JSONObject, event: Requested) => {
  const intrests = Object.keys(data).filter(
    (key) => key !== "Name" && key !== "Description" && key !== "ImageURL",
  );
  data.Intrests = [...intrests];
  //console.log(data);
  const validated = v.safeParse(userSchema, data);
  if (!validated.success) {
    console.log(validated.issues);
    return {
      success: false,
      error: "Invalid data",
    };
  }
  const output = await UpdateUser({ event: event, session: validated.output });
  console.log(output);
  return {
    success: true,
    data: output,
  };
};
export const joinRequest = async (data: JSONObject, event: Requested) => {
  const validated = v.safeParse(joinRequestSchema, data);
  if (validated.success) {
    const user = await GetUser({ event: event });
    if (user) {
      const content = await createJoinRequest({
        event: event,
        requestData: {
          ...validated.output,
          background: validated.output.Background,
          why: validated.output.WhyJoin,
          experience: validated.output.ExperienceLevel,
          userId: user.ID,
          eventId: parseInt(event.params.id),
        },
      });
      return content;
    }

    return {
      success: false,
      data: null,
      error: "Invalid data",
      status: 400,
    };
  }
};

export const createEventForm = async (data: JSONObject, event: Requested) => {
  /*
  const mockEventForm = {
    Name: "Test Event",
    Description: "Test Description",
    Location: "Test Location",
    Coordinates: [0, 0],
    StartTime: "12:00",
    EndTime: "14:00",
    Tags: ["JavaScript", "React", "Node.js"],
  };
  */
  const validated = v.safeParse(eventSchema, data);
  console.log(validated);

  if (!validated.success) {
    return {
      success: false,
      data: null,
      error: "Invalid data",
      status: 400,
    };
  }
  const output = await CreateEvent({
    event: event,
    session: validated.output,
    Client: null,
  });

  if (output === null || output === undefined) {
    return {
      success: false,
      data: null,
      error: "Failed to create event",
    };
  }
  return {
    success: true,
    data: output,
  };
};
