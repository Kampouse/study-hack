import { component$ } from "@builder.io/qwik";

export const EventCard = component$(
  (props: {
    event: {
      id: number;
      title: string;
      image: string;
      badge: string;
      type: string;
      date: string;
      time: string;
      location: string;
      creator: string;
      attendees: number;
      spotsLeft: number;
    };
  }) => {
    return (
      <div
        key={props.event.id}
        class="overflow-hidden rounded-xl border-none shadow-md transition-shadow hover:shadow-lg"
      >
        <div class="flex flex-col md:flex-row h-auto md:h-56 lg:h-64">
          <div class="relative md:w-2/5">
            <img
              src={props.event.image || "/placeholder.svg"}
              width={400}
              height={300}
              alt={props.event.title}
              class="h-full md:h-full w-full object-cover max-h-56 md:max-h-none"
            />
            <div class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#D98E73]">
              {props.event.badge}
            </div>
          </div>
          <div class="flex flex-col justify-between bg-white p-5 md:w-3/5">
            <div>
              <div class="mb-2 flex items-center gap-2">
                <span class="text-sm text-[#8B5A2B]">
                  By {props.event.creator}
                </span>
              </div>
              <span class="mb-2 inline-block rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]">
                {props.event.type}
              </span>
              <h3 class="mb-2 text-lg font-semibold text-[#5B3E29]">
                {props.event.title}
              </h3>
              <div class="grid grid-cols-2 gap-2 text-sm text-[#6D5D4E]">
                <div>
                  <span>{props.event.date}</span>
                </div>
                <div>
                  <span>{props.event.time}</span>
                </div>
                <div>
                  <span>{props.event.location}</span>
                </div>
                <div>
                  <span>{props.event.spotsLeft} spots left</span>
                </div>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F8D7BD] text-xs font-medium text-[#8B5A2B]"
                  >
                    {i}
                  </div>
                ))}
                <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E6F2FF] text-xs font-medium text-[#5B8CB7]">
                  +{props.event.attendees - 3}
                </div>
              </div>
              <button
                type="button"
                class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
