import { component$ } from "@builder.io/qwik";
import type { Event } from "./types";

interface CommunityEventsSectionProps {
  events: Event[];
}

// Color variables
const colors = {
  background: "#FFF1E6",
  primary: "#D98E73",
  text: {
    heading: "#5B3E29",
    body: "#6D5D4E",
  },
};

export const CommunityEventsSection = component$<CommunityEventsSectionProps>(
  ({ events }) => {
    return (
      <section class={`bg-[${colors.background}] py-24`}>
        <div class="container mx-auto px-4">
          <h2
            class={`mb-16 text-center text-4xl font-bold tracking-tight text-[${colors.text.heading}]`}
          >
            <span class={`border-b-4 border-[${colors.primary}] pb-2`}>
              Upcoming Community Events
            </span>
          </h2>
          <div class="grid gap-8 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                class="group flex transform overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div class="relative w-2/5">
                  <img
                    src={event.image}
                    alt={event.title}
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    width={250}
                    height={300}
                  />
                  <div class="absolute left-4 top-4">
                    <span
                      class={`rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[${colors.primary}] backdrop-blur-sm`}
                    >
                      {event.badge}
                    </span>
                  </div>
                </div>
                <div class="flex-1 p-8">
                  <span
                    class={`mb-3 inline-block rounded-full bg-[${colors.background}] px-4 py-1 text-sm font-semibold text-[${colors.primary}]`}
                  >
                    {event.type}
                  </span>
                  <h3
                    class={`mb-4 text-xl font-semibold text-[${colors.text.heading}] transition duration-300 group-hover:text-[${colors.primary}]`}
                  >
                    {event.title}
                  </h3>
                  <div class={`space-y-4 text-sm text-[${colors.text.body}]`}>
                    <div class="flex items-center gap-3">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                      </svg>
                      <span class="font-medium">
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div class="flex items-center gap-3">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3z" />
                      </svg>
                      <span>{event.attendees} Attendees</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
);
