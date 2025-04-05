import { component$ } from "@builder.io/qwik";
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
  );
});
