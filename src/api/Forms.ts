import { UpdateUser, CreateEvent } from "~/helpers/query";
import type { Requested } from "~/helpers/drizzled";
import type { JSONObject } from "@builder.io/qwik-city";
import * as v from "valibot";

export const eventSchema = v.object({
  Name: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  Description: v.pipe(v.string(), v.minLength(3), v.maxLength(75)),
  Location: v.pipe(v.string(), v.minLength(3), v.maxLength(75)),
  Coordinates: v.optional(v.tuple([v.number(), v.number()]), [0, 0]),
  StartTime: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  EndTime: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  Tags: v.optional(v.array(v.pipe(v.string(), v.minLength(3), v.maxLength(20))), ["JavaScript", "", ""]),
});
export type CreateEventForm = v.InferOutput<typeof eventSchema>;

export const userSchema = v.object({
  Name: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
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
  const output = await UpdateUser(event, validated.output);
  console.log(output);
  return {
    success: true,
    data: output,
  };
};

export const createEventForm = async (data: JSONObject, event: Requested) => {
  const validated = v.safeParse(eventSchema, data);
  if (!validated.success) {
    return {
      success: false,
      error: "Invalid data",
    }
  }
  const output = await CreateEvent(event, validated.output);
  console.log(output);
  return {
    success: true,
    data: output,
  };
};