import type { Space } from "./types";
import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
interface CommunitySpacesSectionProps {
  spaces: Space[];
}

export const CommunitySpacesSection = component$<CommunitySpacesSectionProps>(
  ({ spaces }) => {
    return (
      <section class="py-24">
        <div class="container mx-auto px-4">
          <div class="mb-16 flex flex-col items-center">
            <h2 class="mb-4 text-center text-4xl font-bold tracking-tight text-[#5B3E29]">
              <span class="border-b-4 border-[#D98E73] pb-2">
                Curated Community Spaces
              </span>
            </h2>
            <Link
              href="/login"
              class="mt-4 transform rounded-full bg-[#D98E73] px-6 py-2 text-sm font-medium text-white shadow-md transition duration-300 hover:scale-105 hover:bg-[#c07b61] hover:shadow-lg active:press"
            >
              <div class="flex items-center gap-2">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Share Your Cozy Space
              </div>
            </Link>
          </div>
          <div class="grid gap-8 md:grid-cols-3">
            {spaces.map((space) => (
              <div
                key={space.id}
                class="group transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div class="relative overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.name}
                    class="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
                    width={400}
                    height={300}
                  />
                  <div class="absolute right-4 top-4">
                    <span class="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#D98E73] backdrop-blur-sm">
                      {space.badge}
                    </span>
                  </div>
                </div>
                <div class="p-6">
                  <div class="mb-3 flex items-center gap-2 text-[#6D5D4E]">
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <span class="text-sm">{space.location}</span>
                  </div>
                  <h3 class="mb-3 text-xl font-semibold text-[#5B3E29] transition duration-300 group-hover:text-[#D98E73]">
                    {space.name}
                  </h3>
                  <p class="mb-4 text-sm leading-relaxed text-[#6D5D4E]">
                    {space.description}
                  </p>
                  <div class="flex justify-between">
                    <div class="flex gap-2">
                      {space.tags.map((tag, index) => (
                        <span
                          key={index}
                          class="rounded-full bg-[#F8D7BD] px-3 py-1 text-xs font-medium text-[#8B5A2B]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div class="flex items-center gap-1 text-[#D98E73]">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="font-semibold">{space.rating}</span>
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
