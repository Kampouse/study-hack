import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const HeroSection = component$(() => {
  return (
    <section class="relative overflow-hidden bg-gradient-to-b from-[#A67C52] to-[#C49A6C] py-28">
      <div class="absolute inset-0 bg-[url('/cozy-pattern.svg')] opacity-10"></div>
      {/* Subtle warm glow effects */}
      <div class="opacity-15 absolute inset-0">
        <div class="absolute left-10 top-20 h-20 w-20 animate-pulse rounded-full bg-[#DDB892] blur-xl"></div>
        <div class="absolute bottom-20 right-10 h-24 w-24 animate-pulse rounded-full bg-[#C8976E] blur-xl"></div>
        <div class="absolute left-1/4 top-1/2 h-32 w-32 animate-pulse rounded-full bg-[#D4B996] blur-xl"></div>
      </div>
      <div class="container relative mx-auto px-4">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div class="space-y-8">
            <h1 class="text-4xl font-bold leading-tight tracking-tight text-[#FEFAF6] md:text-6xl">
              Reach & Discover
              <br />
              <span class="bg-gradient-to-r from-[#F0D9B5] to-[#DDB892] bg-clip-text text-transparent">
                Cozy Gatherings
              </span>
            </h1>
            <p class="max-w-xl text-lg leading-relaxed text-[#FEFAF6]">
              A warm community platform where you can discover and share
              Montreal's coziest spots and connect through heartfelt gatherings.
            </p>
            <div class="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                class="group relative flex transform items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#DDB892] to-[#C8976E] px-7 py-3.5 text-lg font-medium text-[#FEFAF6] shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(221,184,146,0.4)]"
              >
                <span class="relative z-10">Join Our Community</span>
                <svg
                  class="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                <span class="absolute inset-0 z-0 bg-gradient-to-r from-[#C8976E] to-[#DDB892] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Link>
              <button class="group relative flex transform items-center justify-center gap-2 rounded-xl border-2 border-[#E6CCB2] bg-transparent px-7 py-3.5 text-lg font-medium text-[#E6CCB2] transition-all duration-300 hover:scale-[1.03] hover:bg-[#A67C52]/20 hover:shadow-[0_0_10px_rgba(230,204,178,0.2)]">
                How It Works
                <span class="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-[#E6CCB2] transition-all duration-300 group-hover:w-3/4 group-hover:translate-x-[-50%]"></span>
              </button>
            </div>
          </div>
          <div class="relative transform transition-all duration-500">
            <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#F0D9B5] to-[#C8976E] opacity-20 blur-xl"></div>
            <div class="relative overflow-hidden rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
              <img
                src="https://images.unsplash.com/photo-1497644083578-611b798c60f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y296eSUyMGNhZmV8ZW58MHx8MHx8fDA%3D&w=600&q=80"
                alt="Warm and cozy café in Montreal"
                class="w-full transform object-cover transition duration-500 hover:rotate-3 hover:brightness-110"
                width={600}
                height={500}
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#A67C52]/40 to-transparent"></div>
            </div>
            <div class="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#F0D9B5] opacity-50 blur-xl"></div>
            <div class="absolute -left-4 -top-4 h-12 w-12 rounded-full bg-[#DDB892] opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
});
// tailwind.config.js
