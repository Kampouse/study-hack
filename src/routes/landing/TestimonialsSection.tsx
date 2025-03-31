import { component$ } from "@builder.io/qwik";

export const TestimonialsSection = component$(() => {
  return (
    <section class="py-12">
      <div class="container mx-auto px-4">
        <h2 class="mb-16 text-center text-4xl font-bold tracking-tight text-[#5B3E29]">
          <span class="border-b-4 border-[#D98E73] pb-2">
            What Our Community Says
          </span>
        </h2>
        <div class="grid gap-8 md:grid-cols-3">
          <div class="rounded-2xl bg-white p-8 shadow-xl">
            <div class="mb-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt="Sarah M."
                class="h-14 w-14 rounded-full object-cover"
                width={56}
                height={56}
              />
              <div>
                <h4 class="text-lg font-semibold text-[#5B3E29]">Sarah M.</h4>
                <p class="text-sm text-[#6D5D4E]">Digital Nomad</p>
              </div>
            </div>
            <p class="text-[#6D5D4E]">
              "I've discovered amazing hidden gems and made genuine connections
              through this platform. The community events are thoughtfully
              curated and always memorable."
            </p>
          </div>
          <div class="rounded-2xl bg-white p-8 shadow-xl">
            <div class="mb-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt="David L."
                class="h-14 w-14 rounded-full object-cover"
                width={56}
                height={56}
              />
              <div>
                <h4 class="text-lg font-semibold text-[#5B3E29]">David L.</h4>
                <p class="text-sm text-[#6D5D4E]">Local Artist</p>
              </div>
            </div>
            <p class="text-[#6D5D4E]">
              "As an artist, finding inspiring spaces to work is essential. This
              platform has introduced me to perfect spots and a supportive
              community of creative minds."
            </p>
          </div>
          <div class="rounded-2xl bg-white p-8 shadow-xl">
            <div class="mb-6 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt="Marie C."
                class="h-14 w-14 rounded-full object-cover"
                width={56}
                height={56}
              />
              <div>
                <h4 class="text-lg font-semibold text-[#5B3E29]">Marie C.</h4>
                <p class="text-sm text-[#6D5D4E]">Student</p>
              </div>
            </div>
            <p class="text-[#6D5D4E]">
              "The study groups and workshops have been invaluable for my
              learning journey. I've found amazing study spots and met wonderful
              people who share my interests."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});
