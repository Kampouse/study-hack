import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  CalendarIcon as Calendar,
  ClockIcon as Clock,
  MapPinIcon as MapPin,
  UsersIcon as Users,
  HeartIcon as Heart,
} from "lucide-qwik";

export const DetailedEventCard = component$(
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
        <div class="flex h-full flex-col md:flex-row">
          <div class="relative md:w-1/3">
            <img
              src={props.event.image || "/placeholder.svg"}
              width={400}
              height={300}
              alt={props.event.title}
              class=" h-72 w-full object-cover"
            />
            <div class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#D98E73]">
              {props.event.badge}
            </div>
          </div>
          <div class="flex flex-col justify-between bg-white p-5 md:w-2/3">
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <div class="mb-2 flex items-center gap-2">
                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8D7BD]">
                      <Users class="h-3 w-3 text-[#8B5A2B]" />
                    </div>
                    <span class="text-sm text-[#8B5A2B]">
                      By {props.event.creator}
                    </span>
                  </div>
                  <span class="mb-2 inline-block rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]">
                    {props.event.type}
                  </span>
                  <h3 class="mb-2 text-xl font-semibold text-[#5B3E29]">
                    {props.event.title}
                  </h3>
                </div>
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#D98E73] hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D98E73]"
                >
                  <Heart class="h-5 w-5" />
                </button>
              </div>
              <p class="mb-4 text-[#6D5D4E]">
                Join us for a collaborative session focused on learning and
                sharing knowledge in a cozy environment.
              </p>
              <div class="mb-4 grid grid-cols-2 gap-3">
                <div class="flex items-center gap-2">
                  <Calendar class="h-4 w-4 text-[#D98E73]" />
                  <span class="text-sm text-[#6D5D4E]">{props.event.date}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Clock class="h-4 w-4 text-[#D98E73]" />
                  <span class="text-sm text-[#6D5D4E]">{props.event.time}</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin class="h-4 w-4 text-[#D98E73]" />
                  <span class="text-sm text-[#6D5D4E]">
                    {props.event.location}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <Users class="h-4 w-4 text-[#D98E73]" />
                  <span class="text-sm text-[#6D5D4E]">
                    {props.event.attendees} attendees ({props.event.spotsLeft}{" "}
                    spots left)
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
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
              <Link
                href={`/join/${props.event.id}`}
                type="button"
                class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Join Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
