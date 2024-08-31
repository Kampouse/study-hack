import { component$, useStore } from "@builder.io/qwik";
import { routeAction$ } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import { createEventForm } from "~/api/Forms";
import { useNavigate } from "@builder.io/qwik-city";

export const useCreateEvent = routeAction$(async (data, event) => {
  try {
    return createEventForm(data, event);
  } catch (error) {
    console.error(error);
  }
});

export default component$(() => {
  const interests = ["JavaScript", "Python", "Stuff", "Plants", "Things"];

  const store = useStore({
    name: "",
    description: "",
    location: "",
    coordinates: [],
    date: "",
    startTime: "",
    endTime: "",
    tags: [],
  });

  const action = useCreateEvent();
  const nav = useNavigate();
  return (
    <div class="flex justify-center py-4">
      <div class="flex w-[500px] flex-col content-center gap-6 rounded-3xl bg-white p-8 py-6 shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
        <div class="flex flex-col items-center gap-2">
          <h2 class="text-3xl">Create your Event</h2>
          <p class="text-xl text-[#505050]">
            Add details and create your event
          </p>
        </div>
        <Form
          onSubmitCompleted$={() => {
            nav("/app/new/success/1");
          }}
          action={action}
          class="flex flex-col gap-4"
        >
          <div class="flex flex-col gap-2">
            <label>Event name</label>
            <input
              class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
              type="text"
              id="name"
              name="name"
              placeholder="Just studyin' for fun :/"
              value={store.name}
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="what">What will you be working on?</label>
            <input
              class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
              type="text"
              id="description"
              name="description"
              placeholder="I will be learning about machine learning."
              value={store.description}
            />
          </div>

          <div class="flex flex-col gap-2">
            <label>Where will you be?</label>
            <input
              class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
              type="search"
              id="location"
              name="location"
              placeholder="Somewhere beyond the sea..."
              value={store.location}
            />
          </div>

          <div class="flex items-center gap-4">
            <div class="flex w-full flex-col gap-2">
              <label>Date</label>
              <input
                class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                type="date"
                id="date"
                name="date"
                placeholder="03/03/24"
                value={store.date}
              />
            </div>
            <div class="flex w-full flex-col gap-2">
              <label>Time</label>
              <input
                class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black outline-none focus:border-[#90EE90]"
                type="time"
                id="time"
                name="time"
                placeholder="16h30"
                value={store.date}
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label>Select interests</label>
            <select class="rounded-lg border border-gray-300 bg-white p-3 text-sm text-black focus:border-[#90EE90]">
              {interests.map((item) => {
                const id = item.indexOf(item);
                return <option key={id}>{item}</option>;
              })}
            </select>
          </div>

          <button
            class="rounded-lg bg-[#90EE90] p-2.5 shadow-sm hover:opacity-80"
            type="submit"
          >
            hello
          </button>
        </Form>
      </div>
    </div>
  );
});