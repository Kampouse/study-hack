import { UpdateUser } from "~/helpers/query";
import type { Requested } from "~/helpers/drizzled";
import type { JSONObject } from "@builder.io/qwik-city";
import * as v from "valibot";
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
