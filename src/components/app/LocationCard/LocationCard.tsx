import { component$ } from "@builder.io/qwik";
import { Tag } from "./Tag";
import { Link } from "@builder.io/qwik-city";
export type LocationCardProps = {
  name: string;
  description: string;
  address: string;
  tags: string[];
  rating: number;
  image: string;
  id: number;
  link: string;
};

export const ShareLocationCard = component$(() => {
  const suggestedTags = ["Wi-Fi", "Open Late"];

  return (
    <div>
      <article class="flex h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4   shadow-[0px_4px_12px_rgba(0,0,0,0.04)] transition-colors hover:border-gray-400 lg:w-full">
        <div class="flex h-full flex-col justify-between">
          <header class="relative flex aspect-[2.85] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-gray-100 px-14 py-10"></header>
          <div class="mt-2.5 flex w-full flex-col text-start">
            <h2 class="text-lg font-medium text-gray-950">
              Share Your Favorite Place
            </h2>
            <p class="mt-1.5 text-start  text-sm text-neutral-400">
              Help others discover great study spots!
            </p>
          </div>
          <div class="mt-4 flex flex-wrap  justify-start gap-2">
            {suggestedTags.map((tag, index) => (
              <Tag key={index} text={tag} />
            ))}
          </div>
          <div class="mt-auto flex justify-start py-2">
            <Link
              href="/places/new"
              class=" flex items-center justify-center gap-0.5 overflow-hidden rounded-xl bg-black px-3  py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-base"
            >
              Add a Place
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
});
export const LocationCard = component$((props: LocationCardProps) => {
  return (
    <article class="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <header class="relative flex aspect-[2.85] w-full flex-col items-center justify-center overflow-hidden rounded-xl">
        <img
          loading="lazy"
          src={props.image}
          class="absolute inset-0 h-full w-full object-cover"
          alt=""
          width={1000}
          height={1000}
        />
      </header>
      <div class="mt-2.5 flex w-full flex-col font-medium text-neutral-400">
        <h2 class="text-sm text-gray-950 sm:text-base md:text-lg">
          {props.name}
        </h2>
        <p class="mt-1.5 text-xs leading-normal sm:text-sm">
          {props.description}
        </p>
        <address class="mt-1.5 text-ellipsis text-xs uppercase not-italic leading-normal tracking-wide sm:text-sm">
          {props.address}
        </address>
      </div>
      <div class="mt-4 flex flex-wrap justify-start gap-2">
        {props.tags.map((tag, index) => (
          <Tag key={index} text={tag} />
        ))}
      </div>
      <div class="flex flex-row">
        {/*

        <RatingDisplay
          link={props.link}
          rating={props.rating}
          images={imgs}
        />


        */}
      </div>
      <div class="mt-auto flex justify-start py-2">
        <a
          href={"/places/" + props.id}
          class="flex items-center justify-center gap-0.5 overflow-hidden rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-base"
        >
          Learn more
        </a>
      </div>
    </article>
  );
});
