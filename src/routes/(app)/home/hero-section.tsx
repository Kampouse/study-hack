import { PlusIcon as Plus, MapPinIcon as MapPin } from "lucide-qwik";
import { component$ } from "@builder.io/qwik";
export const HeroSection = component$(() => {
  return (
    <section class="relative bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] pb-12 pt-8">
      <div class="absolute right-10 top-20 h-64 w-64 rounded-full bg-[#F8D7BD] opacity-20 blur-3xl"></div>
      <div class="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-[#A7D7E8] opacity-20 blur-3xl"></div>

      <div class="container px-4 md:px-6">
        <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div class="mb-2 flex items-center gap-2">
              <h1 class="text-3xl font-bold text-[#5B3E29]">
                Discover Cozy Spaces
              </h1>
              <span class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#D98E73] to-[#C27B62] px-2.5 py-0.5 text-xs font-medium text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class="mr-1 h-3 w-3"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                BETA
              </span>
            </div>
            <p class="max-w-2xl text-[#6D5D4E]">
              Find the perfect cozy spot or event shared by our community
              members
            </p>
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <MapPin class="mr-2 h-4 w-4" />
              Show Map
            </button>
            <button
              type="button"
              class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Plus class="mr-2 h-4 w-4" />
              Share a Spot
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});
