import * as Icons from "lucide-qwik";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, useForm } from "@modular-forms/qwik";
import { valiForm$ } from "@modular-forms/qwik";
import { joinRequest, joinRequestSchema } from "~/api/Forms";
import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import type * as v from "valibot";
import { getEvent } from "~/api/EndPoint";
import type { JoinEvent } from "~/../drizzle/schema";
type JoinRequest = v.InferInput<typeof joinRequestSchema>;
export const head = {
  title: "S&H | Join Event",
  description: "Join the Web Development Enthusiasts Meetup",
};

export const useEventDetails = routeLoader$(async (request) => {
  const payload = await getEvent(request, request.params.id);
  if (payload.data == null) {
    //throw request.redirect(302, "/join/");
  }
  return {
    data: { ...payload.data, success: payload.success },
  };
});
export const useFormLoader = routeLoader$<InitialValues<JoinRequest>>(
  async () => {
    return {
      Name: "",
      ExperienceLevel: "",
      Background: "",
      WhyJoin: "",
    };
  },
);
export type Res = {
  success: boolean;
  data?: JoinEvent;
  message: string;
};
export const action = formAction$<JoinRequest, Res>(
  async (data, event) => {
    const stuff = await joinRequest(data, event);

    if (stuff && stuff.success && stuff.data != null) {
      event.redirect(302, `/join/${stuff.data.EventID}/success`);
      return {
        data: stuff,
        message: "Join request sent successfully",
      };
    }
    return {
      success: false,
      message: "Join request failed",
    };
  },

  valiForm$(joinRequestSchema),
);

export default component$(() => {
  const event = useEventDetails();
  const userid = event.value.data.user?.UserID.toString();
  const [, { Form, Field }] = useForm<JoinRequest, Res>({
    validate: valiForm$(joinRequestSchema),
    loader: useFormLoader(),
    action: action(),
  });

  return (
    <div class="m-4 mx-auto max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <h1 class="p-6 text-2xl font-semibold tracking-tight text-gray-900">
        {event.value.data.event?.name || "Event Name"}
      </h1>
      <div class="px-6 pb-4">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm">
            <Icons.CalendarIcon class="h-4 w-4 text-gray-500" />
            <p class="text-gray-600">
              {new Date(
                event.value.data.event?.date || "0",
              ).toLocaleDateString() || "Event Date"}
            </p>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <Icons.MapPinIcon class="h-4 w-4 text-gray-500" />
            <Link
              class="text-gray-600 hover:underline"
              href={"/places/" + event.value.data.location?.PlaceID.toString()}
            >
              {event.value.data.event?.location || "Event place"}
            </Link>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <Icons.UserIcon class="h-4 w-4 text-gray-500" />
            <Link
              class="text-gray-600 hover:underline"
              href={"/user/" + userid}
            >
              {event.value.data.user?.Name}
            </Link>
          </div>
        </div>
      </div>
      <img
        src={event.value.data.event?.image || "https://via.placeholder.com/800"}
        alt={event.value.data.event?.location || "Event Image"}
        height={400}
        width={800}
        class="h-[400px] w-full rounded-none object-cover px-0"
      />
      <div class="p-6">
        <p class="text-sm text-gray-600">
          {event.value.data.event?.description || "hello"}
        </p>
      </div>
      <Form class="border-t border-gray-100 p-6">
        <div class="space-y-4">
          <Field name="ExperienceLevel">
            {(field, props) => (
              <div class="space-y-2">
                <label
                  for={props.name}
                  class="text-sm font-medium text-gray-700"
                >
                  Experience Level
                </label>
                <select
                  {...props}
                  class={`w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-0 ${
                    field.error ? "border-red-500" : ""
                  }`}
                  value={field.value}
                >
                  <option value="">Select your experience level</option>
                  <option value="curious">Curious</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}
          </Field>
          <Field name="Background">
            {(field, props) => (
              <div class="space-y-2">
                <label
                  for={props.name}
                  class="text-sm font-medium text-gray-700"
                >
                  Background
                </label>
                <textarea
                  {...props}
                  rows={3}
                  class={`w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-0 ${
                    field.error ? "border-red-500" : ""
                  }`}
                  placeholder="Share your background"
                  value={field.value}
                />
              </div>
            )}
          </Field>
          <Field name="WhyJoin">
            {(field, props) => (
              <div class="space-y-2">
                <label
                  for={props.name}
                  class="text-sm font-medium text-gray-700"
                >
                  Why do you want to join?
                </label>
                <textarea
                  {...props}
                  rows={3}
                  class={`w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-0 ${
                    field.error ? "border-red-500" : ""
                  }`}
                  placeholder="Tell us why you want to join"
                  value={field.value}
                />
              </div>
            )}
          </Field>
        </div>
        <button
          type="submit"
          class="mt-4 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Register
        </button>
      </Form>
    </div>
  );
});
