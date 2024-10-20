import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="container mx-auto px-4 py-8">
      <h2 class="mb-6 text-2xl font-bold">Discover New and Popular Places</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Place */}
        <div class="h-fit overflow-hidden rounded-xl bg-white shadow-md">
          <img width="1536" height="1024"
            class="h-48 w-full object-cover"
            src="https://nashvilleguru.com/officialwebsite/wp-content/uploads/2022/09/Nashville-Coffee-Shops-1536x1024.jpg"
            alt="New place"
          />
          <div class="p-6">
            <div class="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              New
            </div>
            <a
              href="#"
              class="mt-2 block text-xl font-semibold text-gray-900 hover:underline"
            >
              Skyline Terrace
            </a>
            <p class="mt-3 text-gray-500">
              A rooftop haven with panoramic city views, perfect for sunset
              gazing.
            </p>
          </div>
        </div>

        {/* Popular Place */}
        <div class="overflow-hidden rounded-xl bg-white shadow-md">
          <img
            class="h-48 w-full object-cover"
            src="/img/popular-place.jpg"
            alt="Popular place"
          />
          <div class="p-6">
            <div class="text-sm font-semibold uppercase tracking-wide text-orange-500">
              Popular
            </div>
            <a
              href="#"
              class="mt-2 block text-xl font-semibold text-gray-900 hover:underline"
            >
              Artisan Alley
            </a>
            <p class="mt-3 text-gray-500">
              A vibrant street filled with local art galleries and boutique
              shops.
            </p>
          </div>
        </div>

        {/* Featured Place */}
        <div class="overflow-hidden rounded-xl bg-white shadow-md">
          <img
            class="h-48 w-full object-cover"
            src="/img/featured-place.jpg"
            alt="Featured place"
          />
          <div class="p-6">
            <div class="text-sm font-semibold uppercase tracking-wide text-green-500">
              Featured
            </div>
            <a
              href="#"
              class="mt-2 block text-xl font-semibold text-gray-900 hover:underline"
            >
              Eco Park
            </a>
            <p class="mt-3 text-gray-500">
              An urban green space promoting sustainability and outdoor
              activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
