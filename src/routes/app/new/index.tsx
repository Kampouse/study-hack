import { component$ } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import { createEventForm } from "~/api/Forms";
import { } from "@modular-forms/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { eventSchema } from "~/api/Forms";
import { useNavigate } from "@builder.io/qwik-city";
import { valiForm$, formAction$ } from "@modular-forms/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import type * as v from "valibot";
import { GetUser } from "~/helpers/query";
//get the type from event schema
type Event = v.InferInput<typeof eventSchema>;
export const useFormLoader = routeLoader$<InitialValues<Event>>(async (req) => {
  const user = await GetUser(req);
  return {
    Name: "chill with " + user?.Name,
    Description: "",
    Location: "",
    ImageURL: "https://example.com/image.jpg",
    Date: "",
    StartTime: "",
    EndTime: "",
    Coordinates: [0, 0],
    Tags: [],
  };
});

//take the return type of createEventForm and return it and remove the promise from it
type Data =
  ReturnType<typeof createEventForm> extends Promise<infer T> ? T : never;

const action = formAction$<Event, Data>(async (data, event) => {
  const output = await createEventForm(data, event);

  if (output.success && output.data != null) {
    return {
      data: output,
      success: true,
      message: "Event created successfully",
    };
  } else if (!output.success && output.error) {
    return {
      data: output,
      success: false,
      message: "Failed to create event",
    };
  } else {
    return {
      data: output,
      success: false,
      message: "Unexpected error occurred",
    };
  }
}, valiForm$(eventSchema));
export default component$(() => {
  const nav = useNavigate();
  const [FormEvent, { Form, Field }] = useForm<Event, Data>({
    loader: useFormLoader(),
    validate: valiForm$(eventSchema),
    action: action(),
  });

  return (
    <div class="flex flex-row  justify-center  py-4 ">
      <div class=" rounded-3xl p-4">
        <div class="flex  flex-col content-center gap-6 rounded-xl   bg-white p-8 py-6 shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-3xl">Create your Event</h2>
            <p class="text-xl text-[#505050]">
              Add details and create your event
            </p>
          </div>
          <Form
            class="flex flex-col gap-4 rounded-lg"
            onSubmit$={() => {
              if (FormEvent.submitted) {
                nav("/app");
              }
            }}
          >
            <Field name="Name">
              {(field, props) => (
                <div class="flex flex-col gap-2">
                  <label>Event name</label>
                  <input
                    {...props}
                    class={`rounded-lg border ${field.error ? "border-red-500" : "border-gray-300"} bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]`}
                    type="text"
                    placeholder="Just studyin' for fun :/"
                    value={field.value}
                  />
                </div>
              )}
            </Field>

            <Field name="Description">
              {(field, props) => (
                <div class="flex flex-col gap-2">
                  <label>What will you be working on?</label>
                  <input
                    {...props}
                    class={`rounded-lg border ${field.error ? "border-red-500" : "border-gray-300"} bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]`}
                    type="text"
                    placeholder="I will be learning about machine learning."
                    value={field.value}
                  />
                </div>
              )}
            </Field>

            <Field name="Location">
              {(field, props) => (
                <div class="flex flex-col gap-2">
                  <label>Where will you be?</label>
                  <input
                    {...props}
                    class={`rounded-lg border ${field.error ? "border-red-500" : "border-gray-300"} bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]`}
                    type="text"
                    placeholder="Somewhere beyond the sea..."
                    value={field.value}
                  />
                </div>
              )}
            </Field>
            <Field name="ImageURL">
              {(field, props) => (
                <div class="flex flex-col gap-2">
                  <label>Image link (optional)</label>
                  <input
                    {...props}
                    class={`rounded-lg border ${field.error ? "border-red-500" : "border-gray-300"} bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]`}
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={field.value}
                  />
                </div>
              )}
            </Field>

            <div class="flex items-center gap-4">
              <Field name="Date">
                {(field, props) => (
                  <div class="flex w-full flex-col gap-2">
                    <label>Date</label>
                    <input
                      {...props}
                      class={`rounded-lg border ${field.error ? "border-red-500" : "border-gray-300"} bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]`}
                      type="date"
                      placeholder="03/03/24"
                      value={field.value}
                    />
                  </div>
                )}
              </Field>
              <Field name="EndTime">
                {(field, props) => (
                  <div class="flex w-full flex-col gap-2">
                    <label>End Time</label>
                    <input
                      {...props}
                      class={`rounded-lg border ${field.error ? "border-red-500" : "border-gray-300"} bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]`}
                      type="time"
                      placeholder="16:30"
                      value={field.value}
                    />
                  </div>
                )}
              </Field>

              <Field name="StartTime">
                {(field, props) => (
                  <div class="flex w-full flex-col gap-2">
                    <label>Start Time</label>
                    <input
                      {...props}
                      class={`rounded-lg border ${field.error ? "border-red-500" : "border-gray-300"} bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]`}
                      type="time"
                      placeholder="16:30"
                      value={field.value}
                    />
                  </div>
                )}
              </Field>
            </div>
            <button
              class="rounded-lg bg-[#90EE90] p-2.5 shadow-sm hover:opacity-80"
              type="submit"
            >
              Create a public Session
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
});
export const head: DocumentHead = {
  // This will be used to resolve the <title> of the page
  title: "S&H | New Event",
  meta: [
    {
      name: "description",
      content: "Create an event to study with others",
    },
    // Open graph
    {
      property: "og:title",
      content: "New Event",
    },
    {
      property: "og:description",
      content: "Create an event to study with others",
    },
  ],
  links: [
    {
      rel: "canonical",
    },
  ],
};
