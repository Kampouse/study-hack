import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { CalendarIcon as Calendar } from "lucide-qwik";

export const CreateEventCard = component$(() => {
  return (
    <div class="overflow-hidden rounded-xl border-2 border-dashed border-[#E6D7C3] bg-white/50">
      <div class="flex h-full flex-col items-center justify-center p-8 text-center">
        <div class="mb-4 rounded-full bg-[#F8D7BD] p-6">
          <Calendar class="h-8 w-8 text-[#D98E73]" />
        </div>
        <h3 class="mb-2 text-xl font-semibold text-[#5B3E29]">
          Host Your Own Session
        </h3>
        <p class="mb-6 text-[#6D5D4E]">
          Have a project you're working on? Invite others to join you at your
          favorite cozy spot!
        </p>
        <Link
          href="/new"
          class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Create Event
        </Link>
      </div>
    </div>
  );
});
