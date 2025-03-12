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
    <div class="container mx-auto max-w-4xl px-4 py-8">
      <div class="overflow-hidden rounded-2xl border border-gray-300 bg-gradient-to-br from-white/80 to-gray-100/50 shadow-sm transition-all duration-300 hover:border-green-100 hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-50/70">
        <div class="p-8">
          <div class="flex items-start justify-between">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 transition-colors duration-300">
              {event.value.data.event?.name || "Event Name"}
            </h1>

            <div class="flex items-center gap-4">
              <div class="flex items-center rounded-full bg-blue-50 px-4 py-1">
                <Icons.UserIcon class="mr-2 h-4 w-4 text-blue-600" />
                <Link
                  class="text-sm font-medium text-blue-600 transition-colors duration-300 hover:text-blue-800"
                  href={"/user/" + userid}
                >
                  {event.value.data.user?.Name}
                </Link>
              </div>
            </div>
          </div>

          <div class="mt-6 flex gap-6">
            <div class="flex items-center rounded-full bg-gray-50 px-4 py-1">
              <Icons.CalendarIcon class="mr-2 h-4 w-4 text-gray-600" />
              <p class="text-sm font-medium text-gray-600">
                {(() => {
                  const eventDate = event.value.data.event?.date;
                  if (!eventDate) return "Event Date";
                  const date = new Date(eventDate);
                  return date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });
                })() || "Event Date"}{" "}
              </p>
            </div>

            <div class="flex items-center rounded-full bg-gray-50 px-4 py-1">
              <Icons.MapPinIcon class="mr-2 h-4 w-4 text-gray-600" />
              <Link
                class="text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
                href={
                  "/places/" + event.value.data.location?.PlaceID.toString()
                }
              >
                {event.value.data.event?.location || "Event place"}
              </Link>
            </div>
          </div>

          <div class="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={
                event.value.data.event?.image ||
                "https://via.placeholder.com/800"
              }
              alt={event.value.data.event?.location || "Event Image"}
              height={400}
              width={800}
              class="size-full absolute inset-0 object-cover transition-transform duration-300 hover:scale-105"
              onError$={(e) => {
                const img = e.target as HTMLImageElement;
                img.src =
                  "https://i.pinimg.com/736x/48/af/17/48af17868bea2ebf4f332e1145d66e16.jpg";
              }}
            />
          </div>

          <p class="mt-8 text-base leading-relaxed text-gray-600">
            {event.value.data.event?.description || "hello"}
          </p>
        </div>

        <Form class="border-t border-gray-200 p-6">
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
                    class={`w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-300 hover:border-green-100 focus:border-gray-300 focus:outline-none focus:ring-0 ${
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
                    class={`w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-300 hover:border-green-100 focus:border-gray-300 focus:outline-none focus:ring-0 ${
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
                    class={`w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-300 hover:border-green-100 focus:border-gray-300 focus:outline-none focus:ring-0 ${
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
            class="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </Form>
      </div>
    </div>
  );
});
