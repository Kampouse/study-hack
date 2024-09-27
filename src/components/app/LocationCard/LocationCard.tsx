import { component$ } from "@builder.io/qwik";
import { Tag } from "./Tag";
export type LocationCardProps = {
  name: string;
  description: string;
  address: string;
  tags: string[];
  rating: number;
  link: string;
};

export const LocationCard = component$((props: LocationCardProps) => {
  return (
    <article class="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] lg:w-full">
      <header class="relative flex aspect-[2.85] w-full flex-col items-center justify-center overflow-hidden rounded-xl px-14 py-10">
        <img
          loading="lazy"
          src="https://hellolaroux.com/wp-content/uploads/2022/05/esplanade-tranquille-montreal-quartier-des-spectacles.jpg"
          class="absolute inset-0 h-full w-full object-cover"
          alt=""
          width={1000}
          height={1000}
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9d86d9147e5822062e107d2ac807972850acb658678ae4643774a3402b4e153?placeholderIfAbsent=true&apiKey=17e6b1f5aff14ccdbcafd5a66c4951ca"
          class="aspect-square w-5 object-contain "
          alt="Location icon"
          width={500}
          height={500}
        />
      </header>
      <div class="mt-2.5 flex w-full flex-col font-medium text-neutral-400">
        <h2 class="text-sm text-gray-950">{props.name}</h2>
        <p class="mt-1.5 text-xs leading-none">{props.description}</p>
        <address class="mt-1.5 text-ellipsis text-xs uppercase not-italic leading-none tracking-wide">
          {props.address}
        </address>
      </div>
      <div class="mt-2.5 flex w-full items-start gap-2.5 text-center text-xs font-medium leading-none text-gray-600">
        {props.tags &&
          props.tags.map((tag, index) => <Tag key={index} text={tag} />)}
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
      <div class="flex justify-start">
        <button class="mt-2 w-fit rounded-full bg-black px-2 py-2 font-medium text-white transition-colors hover:bg-gray-800">
          Learn more
        </button>
      </div>
    </article>
  );
});
