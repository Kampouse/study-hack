import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getPlace } from "~/api/EndPoint";
import { StarIcon } from "lucide-qwik";
import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  InfoIcon,
  ArrowLeftIcon,
} from "lucide-qwik";

export const useloadPlace = routeLoader$(async (context) => {
  const placeName = context.params.name;
  const data = await getPlace({ event: context, id: parseInt(placeName) });

  return { ...data };
});

export default component$(() => {
  const place = useloadPlace();
  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      {/* Hero Header with Image */}
      <div class="relative">
        <div class="absolute left-0 top-0 z-10 w-full">
          <div class="container mx-auto px-4 py-4 md:px-6">
            <a
              href="/places"
              class="inline-flex items-center rounded-lg bg-[#5B3E29]/50 px-3 py-2 text-white transition-colors hover:bg-[#5B3E29]/70"
            >
              <ArrowLeftIcon class="mr-2 h-4 w-4" />
              <span>Back to Places</span>
            </a>
          </div>
        </div>
        <div class="relative h-[50vh] overflow-hidden">
          <div class="absolute inset-0 z-[5] bg-gradient-to-b from-[#5B3E29]/50 to-transparent"></div>
          <img
            width="1920"
            height="1000"
            src={place.value.data?.ImageURL as string}
            alt={place.value.data?.Description}
            class="h-full w-full object-cover"
          />
          <div class="absolute bottom-0 left-0 right-0 z-[5] bg-gradient-to-t from-[#FFF8F0] to-transparent p-8">
            <div class="container mx-auto">
              <h1 class="mb-2 text-3xl font-bold text-[#5B3E29] drop-shadow-sm md:text-4xl lg:text-5xl">
                {place.value.data?.Name}
              </h1>
              <div class="flex w-fit items-center rounded-full bg-white/70 px-3 py-1 text-[#5B3E29] backdrop-blur-sm">
                <MapPinIcon class="mr-2 h-4 w-4 text-[#D98E73]" />
                <span class="font-medium">{place.value.data?.Address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div class="container mx-auto px-4 py-8 md:px-6">
        <div class="mx-auto max-w-4xl">
          <div class="grid gap-6 md:grid-cols-3">
            {/* Main Content - 2/3 width */}
            <div class="space-y-6 md:col-span-2">
              <div class="rounded-xl border border-[#E6D7C3]/50 bg-white p-8 shadow-md transition-all hover:shadow-lg">
                <div class="mb-4 flex items-center">
                  <InfoIcon class="mr-2 h-6 w-6 text-[#D98E73]" />
                  <h2 class="text-xl font-semibold text-[#5B3E29]">
                    About this Place
                  </h2>
                </div>
                <p class="mb-6 leading-relaxed text-[#6D5D4E]">
                  {place.value.data?.Description}
                </p>
              </div>

              <div class="rounded-xl border border-[#E6D7C3]/50 bg-white p-8 shadow-md transition-all hover:shadow-lg">
                <div class="mb-6 flex items-center justify-between">
                  <div class="flex items-center">
                    <CalendarIcon class="mr-2 h-6 w-6 text-[#D98E73]" />
                    <h2 class="text-xl font-semibold text-[#5B3E29]">
                      Previous Events
                    </h2>
                  </div>
                </div>
                <div class="rounded-lg border border-[#E6D7C3] bg-[#F8EDE3]/50 p-4 transition-all hover:shadow-md">
                  <h3 class="mb-2 text-lg font-semibold text-[#5B3E29]">
                    Summer Meetup 2023
                  </h3>
                  <p class="mb-4 text-[#6D5D4E]">
                    A fantastic gathering of local community members for food,
                    music and networking. Featured live performances and local
                    food vendors.
                  </p>
                  <div class="grid grid-cols-2 gap-2 rounded-lg bg-white/50 p-3 text-sm text-[#6D5D4E]">
                    <div class="flex items-center">
                      <CalendarIcon class="mr-2 h-4 w-4 text-[#D98E73]" />
                      <span>August 15, 2023</span>
                    </div>
                    <div class="flex items-center">
                      <UsersIcon class="mr-2 h-4 w-4 text-[#D98E73]" />
                      <span>250 attendees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div class="md:col-span-1">
              <div class="sticky top-6 rounded-xl border border-[#E6D7C3]/50 bg-white p-6 shadow-md">
                <h3 class="mb-4 border-b border-[#E6D7C3] pb-2 text-lg font-semibold text-[#5B3E29]">
                  Quick Info
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <MapPinIcon class="mr-2 h-5 w-5 text-[#D98E73]" />
                    <span class="text-[#6D5D4E]">
                      {place.value.data?.Address}
                    </span>
                  </div>
                  <div class="flex items-center">
                    <StarIcon class="mr-2 h-5 w-5 text-[#D98E73]" />
                    <span class="text-[#6D5D4E]">
                      {Math.floor(place.value.data?.Rating || 0)} out of 5 stars
                    </span>
                  </div>
                  <a
                    href={`/events/create/at/${place.value.data?.PlaceID}`}
                    class="mt-4 block w-full rounded-md bg-[#D98E73] px-4 py-2 text-center font-medium text-white transition-colors hover:bg-[#C27B62]"
                  >
                    Create Event Here
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
