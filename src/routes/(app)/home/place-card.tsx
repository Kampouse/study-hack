import { component$ } from "@builder.io/qwik";
export const PlaceCard = component$(
  (props: {
    place: {
      id: number;
      name: string;
      image: string;
      badge: string;
      location: string;
      description: string;
      tags: string[];
      creator: string;
      rating: number;
    };
  }) => {
    return (
      <div
        key={props.place.id}
        class="group overflow-hidden rounded-xl border-none shadow-md transition-shadow hover:shadow-lg"
      >
        <div class="relative aspect-[4/3] overflow-hidden">
          <img
            src={props.place.image || "/placeholder.svg"}
            width={400}
            height={300}
            alt={props.place.name}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#D98E73]">
            {props.place.badge}
          </div>
          <button
            type="button"
            class="absolute right-3 top-3 flex h-10 items-center justify-center rounded-full bg-black/20 px-4 py-2 text-white ring-offset-background transition-colors hover:bg-white/90 hover:text-[#D98E73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
          </button>
        </div>
        <div class="bg-white p-5">
          <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span class="truncate">{props.place.location}</span>
          </div>
          <h3 class="mb-1 text-lg font-semibold text-[#5B3E29]">
            {props.place.name}
          </h3>
          <p class="mb-3 line-clamp-2 text-sm text-[#6D5D4E]">
            {props.place.description}
          </p>
          <div class="mb-3 flex flex-wrap gap-2">
            {props.place.tags.map((tag: string) => (
              <span
                key={tag}
                class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 text-sm">
              <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8D7BD]">
              </div>
              <span class="text-[#8B5A2B]">By {props.place.creator}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="font-medium text-[#5B3E29]">
                {props.place.rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
