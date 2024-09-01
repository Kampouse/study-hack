import { component$ } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import { createEventForm } from "~/api/Forms";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { eventSchema } from "~/api/Forms";
import { valiForm$, formAction$ } from "@modular-forms/qwik";

import type * as v from "valibot";
//get the type from event schema
type Event = v.InferInput<typeof eventSchema>;


export const useFormLoader = routeLoader$<InitialValues<Event>>(() => ({
  Name: "",
  Description: "",
  Location: "",
  Date: "",
  StartTime: "",
  EndTime: "",
  Coordinates: [0, 0],
  Tags: [],

}));
export default component$(() => {


  const action = formAction$<Event>(async (data, event) => {
    console.log("data", data);
    await createEventForm(data, event);
    event.redirect(301, "/");

  }, valiForm$(eventSchema));

  //  @typescript-eslint/no-unused-vars
  const [, { Form, Field }] = useForm<Event>({
    loader: useFormLoader(),
    validate: valiForm$(eventSchema),
    action: action(),
  });






  return (
    <div class="flex justify-center py-4">
      <div class="flex w-[500px] flex-col content-center gap-6 rounded-3xl bg-white p-8 py-6 shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
        <div class="flex flex-col items-center gap-2">
          <h2 class="text-3xl">Create your Event</h2>
          <p class="text-xl text-[#505050]">
            Add details and create your event
          </p>
        </div>
        <Form class="flex flex-col gap-4"


        >


          <Field name="Name">
            {(field, props) => (
              <div class="flex flex-col gap-2">
                <label>Event name</label>
                <input
                  {...props}
                  class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                  type="text"
                  placeholder="Just studyin' for fun :/"
                  value={field.value}
                />
                {field.error && <div>{field.error}</div>}
              </div>
            )}
          </Field>

          <Field name="Description">
            {(field, props) => (
              <div class="flex flex-col gap-2">
                <label>What will you be working on?</label>
                <input
                  {...props}
                  class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                  type="text"
                  placeholder="I will be learning about machine learning."
                  value={field.value}
                />
                {field.error && <div>{field.error}</div>}
              </div>
            )}
          </Field>

          <Field name="Location">
            {(field, props) => (
              <div class="flex flex-col gap-2">
                <label>Where will you be?</label>
                <input
                  {...props}
                  class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                  type="text"
                  placeholder="Somewhere beyond the sea..."
                  value={field.value}
                />
                {field.error && <div>{field.error}</div>}
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
                    class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                    type="date"
                    placeholder="03/03/24"
                    value={field.value}
                  />
                  {field.error && <div>{field.error}</div>}
                </div>
              )}
            </Field>
            <Field name="EndTime" >
              {(field, props) => (
                <div class="flex w-full flex-col gap-2">
                  <label>End Time</label>
                  <input
                    {...props}
                    class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                    type="time"
                    placeholder="16:30"
                    value={field.value}
                  />
                  {field.error && <div>{field.error}</div>}
                </div>
              )}
            </Field>


            <Field name="StartTime">
              {(field, props) => (
                <div class="flex w-full flex-col gap-2">
                  <label>Start Time</label>
                  <input
                    {...props}
                    class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                    type="time"
                    placeholder="16:30"
                    value={field.value}
                  />
                  {field.error && <div>{field.error}</div>}
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
  );

});
