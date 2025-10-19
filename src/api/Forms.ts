import {
  UpdateUser,
  CreateEvent,
  createJoinRequest,
  GetUser,
} from "~/api/Query";
import type { Requested } from "~/api/drizzled";
import type { JSONObject } from "@builder.io/qwik-city";
import * as v from "valibot";
import { ErrorMessages, formatError } from "~/utils/errorMessages";

export const eventSchema = v.object({
  Name: v.pipe(
    v.string("Name must be a text value"),
    v.minLength(3, "Name must be at least 3 characters long"),
    v.maxLength(50, "Name cannot exceed 50 characters"),
  ),
  Description: v.pipe(
    v.string("Description must be a text value"),
    v.minLength(3, "Description must be at least 3 characters long"),
    v.maxLength(250, "Description cannot exceed 250 characters"),
  ),
  ImageURL: v.optional(
    v.pipe(
      v.string("Image URL must be a text value"),
      v.url("Please enter a valid URL for the image"),
    ),
  ),
  Date: v.pipe(
    v.string("Date must be a text value"),
    v.minLength(3, "Date must be at least 3 characters long"),
    v.maxLength(20, "Date cannot exceed 20 characters"),
  ),
  Location: v.pipe(
    v.string("Location must be a text value"),
    v.minLength(3, "Location must be at least 3 characters long"),
    v.maxLength(75, "Location cannot exceed 75 characters"),
  ),
  Coordinates: v.optional(
    v.tuple([
      v.number("Latitude must be a number"),
      v.number("Longitude must be a number"),
    ]),
    [0, 0],
  ),
  StartTime: v.pipe(
    v.string("Start time must be a text value"),
    v.minLength(3, "Start time must be at least 3 characters long"),
    v.maxLength(20, "Start time cannot exceed 20 characters"),
  ),
  PlaceId: v.optional(v.number("Place ID must be a number")),
  EndTime: v.pipe(
    v.string("End time must be a text value"),
    v.minLength(3, "End time must be at least 3 characters long"),
    v.maxLength(20, "End time cannot exceed 20 characters"),
  ),
});
export const placeSchema = v.object({
  name: v.pipe(
    v.string("Name must be a text value"),
    v.minLength(5, "Name must be at least 5 characters long"),
    v.maxLength(100, "Name cannot exceed 100 characters"),
  ),
  address: v.pipe(
    v.string("Address must be a text value"),
    v.minLength(1, "Address is required"),
    v.maxLength(200, "Address cannot exceed 200 characters"),
  ),
  image: v.optional(
    v.pipe(
      v.string("Image URL must be a text value"),
      v.url("Please enter a valid URL for the image"),
    ),
  ),
  description: v.pipe(
    v.string("Description must be a text value"),
    v.minLength(10, "Description must be at least 10 characters long"),
    v.maxLength(500, "Description cannot exceed 500 characters"),
  ),
  tags: v.optional(v.array(v.string("Tag must be a text value"))),
  rating: v.string("Rating must be a text value"),
  wifispeed: v.optional(v.number("WiFi speed must be a number")),
  hasquietenvironment: v.optional(
    v.boolean("Quiet environment value must be true or false"),
  ),
  price: v.optional(v.string("Price must be a text value")),
  coordinates: v.optional(
    v.tuple([
      v.number("Latitude must be a number"),
      v.number("Longitude must be a number"),
    ]),
  ),
  category: v.optional(v.string("Category must be a text value")),
});

export type PlaceForm = v.InferOutput<typeof placeSchema>;

export const joinRequestSchema = v.object({
  ExperienceLevel: v.pipe(
    v.string("Please select your experience level"),
    v.minLength(3, "Please select your experience level"),
    v.maxLength(20, "Experience level selection is invalid"),
  ),
  Background: v.pipe(
    v.string("Please tell us about your background"),
    v.minLength(
      10,
      "Please provide at least 10 characters about your background",
    ),
    v.maxLength(
      500,
      "Background description is too long (maximum 500 characters)",
    ),
  ),
  WhyJoin: v.pipe(
    v.string("Please tell us why you want to join this event"),
    v.minLength(
      8,
      "Please provide at least 8 characters about why you want to join",
    ),
    v.maxLength(500, "Your response is too long (maximum 500 characters)"),
  ),
});

export type JoinRequestForm = v.InferOutput<typeof joinRequestSchema>;

export type CreateEventForm = v.InferOutput<typeof eventSchema>;
export const userSchema = v.object({
  Name: v.pipe(
    v.string("Name must be a text value"),
    v.minLength(3, "Name must be at least 3 characters long"),
    v.maxLength(100, "Name cannot exceed 100 characters"),
  ),
  Username: v.pipe(
    v.string("Username must be a text value"),
    v.minLength(3, "Username must be at least 3 characters long"),
    v.maxLength(30, "Username cannot exceed 30 characters"),
  ),
  Description: v.pipe(
    v.string("Description must be a text value"),
    v.minLength(3, "Description must be at least 3 characters long"),
    v.maxLength(75, "Description cannot exceed 75 characters"),
  ),
  ImageURL: v.optional(
    v.pipe(
      v.string("Image URL must be a text value"),
      v.url("Please enter a valid URL for the image"),
    ),
  ),
  Intrests: v.array(
    v.pipe(
      v.string("Interest must be a text value"),
      v.minLength(2, "Interest must be at least 2 characters long"),
      v.maxLength(20, "Interest cannot exceed 20 characters"),
    ),
  ),
});
export type UpdateUserForm = v.InferOutput<typeof userSchema>;

export const updateProfileForm = async (data: JSONObject, event: Requested) => {
  const validated = v.safeParse(userSchema, data);
  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return {
      success: false,
      error: firstIssue?.message || ErrorMessages.VALIDATION_FAILED,
      validationErrors: validated.issues,
    };
  }
  const output = await UpdateUser({ event: event, session: validated.output });
  return {
    success: true,
    data: output,
  };
};
export const joinRequest = async (data: JSONObject, event: Requested) => {
  const validated = v.safeParse(joinRequestSchema, data);
  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return {
      success: false,
      data: null,
      error: firstIssue?.message || ErrorMessages.VALIDATION_FAILED,
      validationErrors: validated.issues,
      status: 400,
    };
  }

  const user = await GetUser({ event: event });
  if (!user) {
    return {
      success: false,
      data: null,
      error: ErrorMessages.USER_NOT_AUTHENTICATED,
      status: 401,
    };
  }

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
};

export const createEventForm = async (data: JSONObject, event: Requested) => {
  const validated = v.safeParse(eventSchema, data);

  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return {
      success: false,
      data: null,
      error: firstIssue?.message || ErrorMessages.VALIDATION_FAILED,
      validationErrors: validated.issues,
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
      error: ErrorMessages.EVENT_CREATE_FAILED,
    };
  }
  return {
    success: true,
    data: output,
  };
};
