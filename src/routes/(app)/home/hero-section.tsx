import { component$ } from '@builder.io/qwik'
export const HeroSection = component$(() => {
  return (
    <section class="relative bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] pt-8">
      <div class="container px-4 md:px-6">
        <div class="my-8 flex flex-col items-start justify-between  md:flex-row md:items-center">
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
          <div class="flex gap-3"></div>
        </div>
      </div>
    </section>
  )
})
