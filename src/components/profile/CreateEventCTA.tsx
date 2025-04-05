import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const CreateEventCTA = component$(() => {
  return (
    <section class="mt-16 bg-gradient-to-b from-[#F8EDE3]/50 to-[#FFF8F0]/30 py-20 md:mt-20 md:py-24">
      <div class="container px-4 md:px-6">
        <div class="relative overflow-hidden rounded-2xl bg-white p-10 shadow-lg md:p-16">
          <div
            class="absolute inset-0 opacity-5"
          ></div>

          <div class="relative z-10 flex flex-col items-center gap-10 md:flex-row md:gap-12">
            {" "}
            {/* Increased gap */}
            <div class="w-full md:w-1/3 lg:w-1/4">
              <div class="aspect-square overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105"></div>
            </div>
            <div class="flex-1 text-center md:text-left">
              <h2 class="mb-4 text-3xl font-bold text-[#5B3E29] md:text-4xl">
                {" "}
                {/* Larger title */}
                Ready to Host Your Next Session?
              </h2>
              <p class="mb-8 max-w-xl text-lg text-[#6D5D4E] lg:text-xl">
                {" "}
                {/* Larger text */}
                Create a cozy gathering at your favorite spot or discover new
                ones. Invite friends or meet new people—it's all about
                connection.
              </p>
              <div class="flex flex-wrap justify-center gap-4 md:justify-start">
                <Link
                  href="/create-event"
                  // Larger padding
                  class="inline-flex items-center justify-center rounded-lg bg-[#D98E73] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Create an Event
                </Link>
                <Link
                  href="/spaces"
                  // Larger padding
                  class="inline-flex items-center justify-center rounded-lg border border-[#D98E73]/80 px-6 py-3 text-base font-medium text-[#D98E73] transition-colors hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
                >
                  Browse Spaces
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
