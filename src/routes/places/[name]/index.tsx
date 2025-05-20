import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getPlace } from "~/api/EndPoint";
import { StarIcon } from "lucide-qwik";
import {
  MapPinIcon,
  InfoIcon,
  ArrowLeftIcon,
  MessageSquareIcon,
  ClipboardIcon,
} from "lucide-qwik";

export const useloadPlace = routeLoader$(async (context) => {
  const output = decodeURIComponent(context.params.name);
  // Check if the output is a valid number
  const id = parseInt(output, 10);
  const isId = !isNaN(id);

  // Query getPlace with id when output is a number, otherwise use placeName
  const data = await getPlace({
    event: context,
    placeName: isId ? undefined : output,
    id: isId ? id : undefined,
  });

  return { ...data };
});
export default component$(() => {
  const place = useloadPlace();

  return (
    <div class="min-h-screen bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] px-4 py-12">
      <div class="container mx-auto">
        <div class="mb-8 flex items-center">
          <Link
            href="/places"
            class="flex items-center gap-2 text-[#D98E73] transition hover:text-[#C27B62]"
          >
            <ArrowLeftIcon class="h-5 w-5" />
            <span>Back to Places</span>
          </Link>
        </div>

        {/* Main content card */}
        <div class="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
          {/* Hero card section with image and title */}
          <div class="rounded-3xl bg-white p-6 shadow-md">
            <div class="relative mb-6 overflow-hidden rounded-2xl">
              <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-black/10"></div>
              <img
                src={(place.value.data?.ImageURL as string) || ""}
                alt={place.value.data?.Name}
                class="h-[400px] w-full object-cover transition duration-700 hover:scale-105"
                width={1200}
                height={400}
              />
              <div class="absolute bottom-0 left-0 z-20 p-8 text-white">
                <div class="mb-3 inline-flex items-center rounded-full bg-[#D98E73]/90 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                  <MapPinIcon class="mr-2 h-4 w-4" />
                  <div
                    class="group relative"
                    onClick$={async () => {
                      await navigator.clipboard.writeText(
                        place.value.data?.Address || "",
                      );
                      const el = document.querySelector(".copy-feedback");
                      if (el) {
                        el.classList.remove("opacity-0");
                        el.classList.add("opacity-100");
                        setTimeout(() => {
                          el.classList.remove("opacity-100");
                          el.classList.add("opacity-0");
                        }, 1000);
                      }
                    }}
                  >
                    <span class="cursor-pointer">
                      {place.value.data?.Address}
                    </span>
                    <span class="copy-feedback absolute -right-16 -top-1 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200">
                      Copied!
                    </span>
                  </div>
                </div>
                <h1 class="text-4xl font-bold tracking-tight drop-shadow-lg sm:text-5xl">
                  {place.value.data?.Name}
                </h1>
                <div class="mt-3 flex items-center gap-2">
                  <div class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                    <StarIcon class="mr-1 h-5 w-5 text-yellow-400" />
                    <span class="font-medium">
                      {Math.floor(place.value.data?.Rating || 0)} out of 5 stars
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content grid */}
            <div class="grid gap-8 md:grid-cols-3">
              <section class="space-y-8 md:col-span-2">
                <div class="space-y-4">
                  <h2 class="flex items-center gap-2 text-2xl font-semibold text-[#5B3E29]">
                    <InfoIcon class="h-6 w-6 text-[#D98E73]" />
                    About This Place
                  </h2>
                  <div class="rounded-xl bg-[#F8EDE3] p-6 shadow-sm">
                    <p class="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
                      {place.value.data?.Description}
                    </p>
                  </div>
                </div>

                <div class="mt-8">
                  <h2 class="mb-6 flex items-center gap-2 text-2xl font-semibold text-[#5B3E29]">
                    <MessageSquareIcon class="h-6 w-6 text-[#D98E73]" />
                    Reviews & Comments
                  </h2>
                  <div class="space-y-6">
                    <div class="rounded-xl bg-gray-50 p-6">
                      <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#D98E73] font-semibold text-white">
                            SJ
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h3 class="font-medium text-gray-900">
                              Sarah Johnson
                            </h3>
                            <p class="text-sm text-gray-500">2 days ago</p>
                          </div>
                          <div class="mt-1 flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                class="h-4 w-4 text-yellow-400"
                              />
                            ))}
                          </div>
                          <p class="mt-2 text-gray-700">
                            Great atmosphere and friendly staff! The coffee here
                            is amazing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-6">
                      <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#D98E73] font-semibold text-white">
                            MC
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h3 class="font-medium text-gray-900">
                              Michael Chen
                            </h3>
                            <p class="text-sm text-gray-500">1 week ago</p>
                          </div>
                          <div class="mt-1 flex items-center">
                            {[1, 2, 3, 4].map((star) => (
                              <StarIcon
                                key={star}
                                class="h-4 w-4 text-yellow-400"
                              />
                            ))}
                          </div>
                          <p class="mt-2 text-gray-700">
                            Perfect spot for working remotely. The WiFi is
                            reliable and there are plenty of power outlets.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-6">
                      <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#D98E73] font-semibold text-white">
                            ED
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <h3 class="font-medium text-gray-900">
                              Emma Davis
                            </h3>
                            <p class="text-sm text-gray-500">2 weeks ago</p>
                          </div>
                          <div class="mt-1 flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                class="h-4 w-4 text-yellow-400"
                              />
                            ))}
                          </div>
                          <p class="mt-2 text-gray-700">
                            Love the ambiance here! It's become my go-to place
                            for meeting friends.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div class="space-y-6">
                <section class="rounded-xl border border-[#E6D7C3] bg-white p-6 shadow-sm">
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <MapPinIcon class="h-5 w-5 text-[#D98E73]" />
                      <div class="text-sm text-[#6D5D4E]">
                        <div class="font-medium text-[#5B3E29]">Address:</div>
                        <div class="group flex items-center gap-2">
                          <div>{place.value.data?.Address}</div>
                          <button
                            onClick$={() => {
                              navigator.clipboard.writeText(
                                place.value.data?.Address || "",
                              );
                            }}
                            class="rounded-full p-1 hover:bg-gray-100"
                          >
                            <ClipboardIcon class="h-4 w-4 text-[#D98E73]" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <StarIcon class="h-5 w-5 text-[#D98E73]" />
                      <div class="text-sm text-[#6D5D4E]">
                        <div class="font-medium text-[#5B3E29]">Rating:</div>
                        <div>
                          {Math.floor(place.value.data?.Rating || 0)} out of 5
                          stars
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-6">
                    <Link
                      href={`/new?placeId=${place.value.data?.PlaceID}`}
                      class="block w-full rounded-lg bg-[#D98E73] px-4 py-3 text-center font-medium text-white transition-all hover:bg-[#C27B62] hover:shadow-md"
                    >
                      Create Event Here
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
