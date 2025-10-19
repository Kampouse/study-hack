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
import { ErrorAlert } from "~/components/ui/ErrorAlert";
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
      message:
        (stuff as any)?.error ||
        "We couldn't submit your join request. Please check your answers and try again.",
    };
  },

  valiForm$(joinRequestSchema),
);

export default component$(() => {
  const event = useEventDetails();
  const userid = event.value.data.user?.UserID.toString();
  const [formResponse, { Form, Field }] = useForm<JoinRequest, Res>({
    validate: valiForm$(joinRequestSchema),
    loader: useFormLoader(),
    action: action(),
  });

  return (
    <div class="my-12 min-h-screen bg-white py-8">
      <div class="container mx-auto max-w-4xl px-4">
        <div class="overflow-hidden rounded-xl border border-[#E6D7C3] bg-white shadow-md">
          <div class="p-8">
            {formResponse.response?.message &&
              (formResponse.response.data as any)?.success === false && (
                <ErrorAlert
                  message={formResponse.response.message}
                  type="error"
                />
              )}
            <div class="flex items-start justify-between">
              <h1 class="text-3xl font-bold text-[#5B3E29]">
                {event.value.data.event?.name || "Event Name"}
              </h1>

              <div class="flex items-center gap-4">
                <div class="flex items-center rounded-full bg-[#F8EDE3] px-4 py-1">
                  <Icons.UserIcon class="mr-2 h-4 w-4 text-[#D98E73]" />
                  <Link
                    class="text-sm font-medium text-[#D98E73] hover:text-[#C27B62]"
                    href={"/user/" + userid}
                  >
                    {event.value.data.user?.Name}
                  </Link>
                </div>
              </div>
            </div>

            <div class="mt-6 flex gap-6">
              <div class="flex items-center rounded-full bg-[#F8EDE3] px-4 py-1">
                <Icons.CalendarIcon class="mr-2 h-4 w-4 text-[#D98E73]" />
                <p class="text-sm font-medium text-[#6D5D4E]">
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

              <div class="flex items-center rounded-full bg-[#F8EDE3] px-4 py-1">
                <Icons.MapPinIcon class="mr-2 h-4 w-4 text-[#D98E73]" />
                <Link
                  class="text-sm font-medium text-[#6D5D4E] hover:text-[#D98E73]"
                  href={
                    "/places/" + event.value.data.location?.PlaceID.toString()
                  }
                >
                  {event.value.data.event?.location || "Event place"}
                </Link>
              </div>
            </div>

            <div class="relative mt-8 aspect-[21/9] w-full overflow-hidden rounded-xl bg-[#F8EDE3]">
              <img
                src={
                  event.value.data.event?.image ||
                  "https://via.placeholder.com/800"
                }
                alt={event.value.data.event?.location || "Event Image"}
                height={400}
                width={800}
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
                onError$={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src =
                    "https://i.pinimg.com/736x/48/af/17/48af17868bea2ebf4f332e1145d66e16.jpg";
                }}
              />
            </div>

            <p class="mt-8 text-base leading-relaxed text-[#6D5D4E]">
              {event.value.data.event?.description || "hello"}
            </p>
          </div>

          <Form class="border-t border-[#E6D7C3] bg-[#F8EDE3]/50 p-6">
            <div class="space-y-4">
              <Field name="ExperienceLevel">
                {(field, props) => (
                  <div class="space-y-2">
                    <label
                      for={props.name}
                      class="text-sm font-medium text-[#5B3E29]"
                    >
                      Experience Level
                      {field.error && <span class="ml-1 text-red-600">*</span>}
                    </label>
                    <div class="relative">
                      <select
                        {...props}
                        class={`w-full rounded-xl ${
                          field.error
                            ? "border-2 border-red-600 bg-red-50"
                            : "border border-[#E6D7C3] bg-white"
                        } px-3 py-2 text-sm text-[#5B3E29] shadow-sm transition-colors hover:border-[#D98E73] focus:border-[#D98E73] focus:outline-none focus:ring-0`}
                        value={field.value}
                      >
                        <option value="">Select your experience level</option>
                        <option value="curious">Curious</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                      {field.error && (
                        <Icons.AlertCircleIcon class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                      )}
                    </div>
                    {field.error && (
                      <p class="text-sm font-medium text-red-600">
                        {field.error}
                      </p>
                    )}
                  </div>
                )}
              </Field>
              <Field name="Background">
                {(field, props) => (
                  <div class="space-y-2">
                    <label
                      for={props.name}
                      class="text-sm font-medium text-[#5B3E29]"
                    >
                      Background
                      {field.error && <span class="ml-1 text-red-600">*</span>}
                    </label>
                    <div class="relative">
                      <textarea
                        {...props}
                        rows={3}
                        class={`w-full rounded-xl ${
                          field.error
                            ? "border-2 border-red-600 bg-red-50"
                            : "border border-[#E6D7C3] bg-white"
                        } px-3 py-2 text-sm text-[#5B3E29] shadow-sm transition-colors hover:border-[#D98E73] focus:border-[#D98E73] focus:outline-none focus:ring-0`}
                        placeholder="Share your background"
                        value={field.value}
                      />
                      {field.error && (
                        <Icons.AlertCircleIcon class="absolute right-3 top-3 h-5 w-5 text-red-600" />
                      )}
                    </div>
                    {field.error && (
                      <p class="text-sm font-medium text-red-600">
                        {field.error}
                      </p>
                    )}
                  </div>
                )}
              </Field>
              <Field name="WhyJoin">
                {(field, props) => (
                  <div class="space-y-2">
                    <label
                      for={props.name}
                      class="text-sm font-medium text-[#5B3E29]"
                    >
                      Why do you want to join?
                      {field.error && <span class="ml-1 text-red-600">*</span>}
                    </label>
                    <div class="relative">
                      <textarea
                        {...props}
                        rows={3}
                        class={`w-full rounded-xl ${
                          field.error
                            ? "border-2 border-red-600 bg-red-50"
                            : "border border-[#E6D7C3] bg-white"
                        } px-3 py-2 text-sm text-[#5B3E29] shadow-sm transition-colors hover:border-[#D98E73] focus:border-[#D98E73] focus:outline-none focus:ring-0`}
                        placeholder="Tell us why you want to join"
                        value={field.value}
                      />
                      {field.error && (
                        <Icons.AlertCircleIcon class="absolute right-3 top-3 h-5 w-5 text-red-600" />
                      )}
                    </div>
                    {field.error && (
                      <p class="text-sm font-medium text-red-600">
                        {field.error}
                      </p>
                    )}
                  </div>
                )}
              </Field>
            </div>
            <button
              type="submit"
              class="mt-4 w-full rounded-xl bg-[#D98E73] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D98E73] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Join Session
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
});
