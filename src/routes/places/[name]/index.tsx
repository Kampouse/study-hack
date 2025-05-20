import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getPlace } from "~/api/EndPoint";
import { StarIcon } from "lucide-qwik";
import {
  MapPinIcon,
  InfoIcon,
  MessageSquareIcon,
  ClipboardIcon,
} from "lucide-qwik";

const reviewsData = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    timeAgo: "2 days ago",
    rating: 5,
    comment: "Great atmosphere and friendly staff! The coffee here is amazing.",
  },
  {
    initials: "MC",
    name: "Michael Chen",
    timeAgo: "1 week ago",
    rating: 4,
    comment:
      "Perfect spot for working remotely. The WiFi is reliable and there are plenty of power outlets.",
  },
  {
    initials: "ED",
    name: "Emma Davis",
    timeAgo: "2 weeks ago",
    rating: 5,
    comment:
      "Love the ambiance here! It's become my go-to place for meeting friends.",
  },
];

const ReviewCard = component$(
  (props: {
    initials: string;
    name: string;
    timeAgo: string;
    rating: number;
    comment: string;
  }) => {
    return (
      <div class="rounded-xl bg-gray-50 p-6">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#D98E73] font-semibold text-white">
              {props.initials}
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900">{props.name}</h3>
              <p class="text-sm text-gray-500">{props.timeAgo}</p>
            </div>
            <div class="mt-1 flex items-center">
              {[...Array(props.rating)].map((_, i) => (
                <StarIcon key={i} class="h-4 w-4 text-yellow-400" />
              ))}
            </div>
            <p class="mt-2 text-gray-700">{props.comment}</p>
          </div>
        </div>
      </div>
    );
  },
);

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
        <div class="mb-8 flex items-center"></div>

        {/* Main content card */}
        <div class="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
          {/* Hero card section with image and title */}
          <div class="rounded-3xl bg-white p-6 shadow-md">
            <div class="relative mb-6 overflow-hidden rounded-2xl">
              <img
                src={(place.value.data?.ImageURL as string) || ""}
                alt={place.value.data?.Name}
                class="h-[400px] w-full object-cover"
                width={1200}
                height={400}
              />
              <div class="absolute bottom-0 left-0 z-20 p-8 text-white">
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
                    {reviewsData.map((review) => (
                      <ReviewCard key={review.initials} {...review} />
                    ))}
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
                        <button
                          onClick$={() => {
                            navigator.clipboard.writeText(
                              place.value.data?.Address || "",
                            );
                          }}
                          class="group flex w-full items-center gap-2 rounded-lg p-1 transition hover:bg-gray-100"
                        >
                          <div>{place.value.data?.Address}</div>
                          <ClipboardIcon class="h-4 w-4 text-[#D98E73]" />
                        </button>
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
