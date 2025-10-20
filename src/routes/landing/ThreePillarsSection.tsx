import { component$ } from '@builder.io/qwik'
export const ThreePillarsSection = component$(() => {
  return (
    <section class="bg-[hsl(33,56%,93%)] py-24">
      <div class="container mx-auto px-4">
        <h2 class="mb-16 text-center text-4xl font-bold tracking-tight text-[hsl(28,45%,29%)]">
          <span class="border-b-4 border-[hsl(32,47%,75%)] pb-2">
            Our Three Pillars
          </span>
        </h2>
        <div class="grid gap-8 md:grid-cols-3">
          <div class="rounded-2xl bg-[hsl(32,47%,85%)] p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-[hsl(32,47%,80%)] hover:shadow-xl">
            <div class="mb-6 inline-block rounded-full bg-[hsl(32,33%,98%)] p-4">
              <svg
                class="h-8 w-8 text-[hsl(28,45%,29%)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 class="mb-4 text-2xl font-semibold text-[hsl(28,45%,29%)]">
              Create
            </h3>
            <p class="text-[hsl(28,29%,49%)]">
              Share your favorite cozy spots and organize meaningful events that
              bring people together.
            </p>
          </div>
          <div class="rounded-2xl bg-[hsl(32,47%,85%)] p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-[hsl(32,47%,80%)] hover:shadow-xl">
            <div class="mb-6 inline-block rounded-full bg-[hsl(32,33%,98%)] p-4">
              <svg
                class="h-8 w-8 text-[hsl(28,45%,29%)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <h3 class="mb-4 text-2xl font-semibold text-[hsl(28,45%,29%)]">
              Share
            </h3>
            <p class="text-[hsl(28,29%,49%)]">
              Connect with like-minded individuals and build a community around
              your favorite spaces.
            </p>
          </div>
          <div class="rounded-2xl bg-[hsl(32,47%,85%)] p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-[hsl(32,47%,80%)] hover:shadow-xl">
            <div class="mb-6 inline-block rounded-full bg-[hsl(32,33%,98%)] p-4">
              <svg
                class="h-8 w-8 text-[hsl(28,45%,29%)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="mb-4 text-2xl font-semibold text-[hsl(28,45%,29%)]">
              Join
            </h3>
            <p class="text-[hsl(28,29%,49%)]">
              Discover and participate in events that match your interests and
              expand your social circle.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
})
