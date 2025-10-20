import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
export const JoinCommunity = component$(() => {
  return (
    <section class="relative overflow-hidden bg-[#5B3E29] py-16 text-white">
      {/* Subtle background effects */}
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D98E73] opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#F8D7BD] opacity-20 blur-3xl"></div>

      <div class="relative flex items-center justify-center px-4 md:px-6">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="mb-4 bg-gradient-to-r from-[#FFE4C4] via-[#FFF1E6] to-white bg-clip-text text-center text-3xl font-bold text-transparent">
            Join Our Community Today
          </h2>
          <p class="mb-8 text-center text-lg leading-relaxed text-[#E6D7C3]">
            Be part of a growing community that shares and discovers cozy spaces
            together. Create events, share your favorite spots, and connect with
            like-minded individuals.
          </p>
          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              class="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#D98E73] via-[#E09B82] to-[#C27B62] px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-[#D98E73]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D98E73]/50 active:translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <span class="relative">
                Join the Community
                <span class="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
})
