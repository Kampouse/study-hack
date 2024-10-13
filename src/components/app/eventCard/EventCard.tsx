/**
 * This code was generated by Builder.io.
 */
import { component$ } from "@builder.io/qwik";
import { Tag } from "./Tag";
import { Link } from "@builder.io/qwik-city";
import { AttendeeList } from "./AttendeeList";

export type EventCardProps = {
  title: string;
  description: string;
  time: string;
  tags: string[];
  attendees: number;
  link: string;
  host?: boolean;
};
const imgs = ["hello", "stuff", "world"];

export const EmptyEventCard = component$(() => {
  return (
    <article class="flex w-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] md:block lg:w-full [&:nth-child(n+4)]:hidden md:[&:nth-child(n+4)]:block">
      <header class="relative flex w-full flex-col items-center  justify-center overflow-hidden rounded-xl px-14 py-10 lg:aspect-[1.8] xl:aspect-[2.3] 2xl:aspect-[2.35]">
        <div class="size-full absolute inset-0 animate-pulse bg-gray-200"></div>
      </header>
      <div class="mt-2.5 flex w-full flex-col font-medium text-neutral-400">
        <div class="h-4 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
        <div class="mt-1.5 h-3 w-full animate-pulse rounded-md bg-gray-200"></div>
        <div class="mt-1.5 h-3 w-1/2 animate-pulse rounded-md bg-gray-200"></div>
      </div>
      <div class="mt-2.5 flex w-full items-start gap-2.5">
        <div class="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
        <div class="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    </article>
  );
});

export const EventCard = component$((props: EventCardProps) => {
  return (
    <article
      id={"#" + props.title}
      class="flex w-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] md:block lg:w-full [&:nth-child(n+4)]:hidden md:[&:nth-child(n+4)]:block"
    >
      <header class="relative mb-auto flex aspect-[2.85] w-full flex-col items-center justify-center overflow-hidden rounded-xl px-14 py-10">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3f0587d3f7ff9e636884c0c2be54daa3f001d89360b3a629cd9b9bf25b05857c?placeholderIfAbsent=true&apiKey=17e6b1f5aff14ccdbcafd5a66c4951ca"
          class="size-full absolute inset-0 object-cover"
          alt=""
          width={500}
          height={500}
        />
        <div class="absolute right-2 top-2">
          <AttendeeList
            link={props.link}
            attendees={props.attendees}
            images={imgs}
          />
        </div>
        <span class="absolute bottom-2 right-2 rounded-lg bg-white bg-opacity-60 px-2 py-1 text-xs font-medium text-gray-800">
          {props.time}
        </span>
      </header>
      <div class="flex flex-grow flex-col justify-between">
        <div class="mt-2.5 flex w-full flex-col font-medium text-neutral-400">
          <div class="flex items-center justify-between">
            <h2 class="text-sm text-gray-950">{props.title}</h2>
            <div class="flex gap-2">
              {props.tags.map((tag, index) => (
                <Tag key={index} text={tag} />
              ))}
            </div>
          </div>
          <p
            class={`mt-1.5 overflow-hidden text-xs leading-none ${props.description.length < 50 ? "min-h-[3em]" : "max-h-10 min-h-[3.3em]"}`}
          >
            {props.description.length > 50
              ? props.description.slice(0, 100) + "..."
              : props.description}
          </p>
        </div>
        <div class="mt-2.5 flex w-full justify-end gap-2.5 text-center text-xs font-medium leading-none text-gray-600"></div>
      </div>
      <Link
        href={`${props.link}`}
        class="flex items-center justify-center gap-0.5 overflow-hidden rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        See Event
      </Link>
    </article>
  );
});
